using System;
using System.Collections.Generic;
using System.Linq;
using AndcultureCode.CSharp.Core;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.CSharp.Extensions;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Jobs;
using AndcultureCode.GB.Business.Core.Interfaces.Workers;
using AndcultureCode.GB.Business.Core.Models.Jobs;
using Hangfire;
using Microsoft.Extensions.Localization;
using AndcultureCode.CSharp.Core.Interfaces.Providers.Worker;

namespace AndcultureCode.GB.Business.Conductors.Domain.Jobs
{
    // TODO: Console.WriteLines should be updated after a logging strategy is complete.
    // They have been kept as a guideline for possible logging information.
    public class JobEnqueueConductor : IJobEnqueueConductor
    {
        #region Public Members

        public const string ERROR_BACKGROUND_JOB_COULD_NOT_BE_ENQUEUED
            = "JobEnqueueConductor.ValidateWorkerFromType.BackgroundJobCouldNotBeEnqueued";

        public const string ERROR_WORKER_NOT_FOUND
            = "JobEnqueueConductor.ValidateWorkerFromType.WorkerNotFound";

        #endregion

        #region Private Members

        private readonly IRepositoryCreateConductor<Job> _jobCreateConductor;
        private readonly IRepositoryUpdateConductor<Job> _jobUpdateConductor;
        private readonly IStringLocalizer _localizer;
        private readonly IServiceProvider _serviceProvider;
        private readonly IEnumerable<IWorker> _workers;
        private readonly IWorkerProvider _workerProvider;

        #endregion

        #region Constructor

        public JobEnqueueConductor(
            IRepositoryCreateConductor<Job> jobCreateConductor,
            IRepositoryUpdateConductor<Job> jobUpdateConductor,
            IStringLocalizer localizer,
            IServiceProvider serviceProvider,
            IEnumerable<IWorker> workers,
            IWorkerProvider workerProvider
        )
        {
            _jobCreateConductor = jobCreateConductor;
            _jobUpdateConductor = jobUpdateConductor;
            _localizer = localizer;
            _serviceProvider = serviceProvider;
            _workers = workers;
            _workerProvider = workerProvider;
        }

        #endregion

        #region IJobEnqueueConductor Implementation

        public IResult<Job> Enqueue<TWorker>(List<object> workerArgs, long? startedById = null)
            where TWorker : IWorker
        {
            return Enqueue(typeof(TWorker), workerArgs, startedById);
        }

        public IResult<Job> Enqueue(
            Type workerType,
            List<object> workerArgs,
            long? startedById = null
        ) => Do<Job>.Try((r) =>
        {
            Type typeToFind = workerType.IsInterface ? _serviceProvider.GetService(workerType).GetType() : workerType;

            var worker = _workers.ToList().Find((e) => e.GetType() == typeToFind);
            string workerName = worker?.Name;

            Console.WriteLine("[JobEnqueueConductor]: Enqueue called.");

            // Create a new job in initial state to enqueue.
            var job = new Job();
            job.SetToInitialState(workerName, workerArgs, startedById);

            var createJobResult = _jobCreateConductor.Create(job);
            createJobResult.ThrowIfAnyErrorsOrResultIsNull();
            job = createJobResult.ResultObject;

            // If we don't have a worker or worker name, record the error and return.
            if (worker == null || string.IsNullOrWhiteSpace(workerName))
            {
                r.AddError(_localizer, ERROR_WORKER_NOT_FOUND, workerType.Name);

                job.SetToErrored(error: r.ListErrors());

                var findWorkerCreateJobResult = _jobUpdateConductor.Update(job);
                findWorkerCreateJobResult.ThrowIfAnyErrorsOrResultIsNull();

                return job;
            }

            Console.WriteLine($"[JobEnqueueConductor]: Enqueueing '{workerName}'");

            var backgroundJobId = _workerProvider.Enqueue(
                () => worker.Execute(job.Id, JobCancellationToken.Null)
            );

            // The worker provider returns a string if the enqueue is successful.
            if (backgroundJobId.IsNullOrEmpty())
            {
                r.AddError(
                    _localizer,
                    ERROR_BACKGROUND_JOB_COULD_NOT_BE_ENQUEUED,
                    nameof(_workerProvider),
                    nameof(workerName)
                );

                job.SetToErrored<Job>(result: r);

                var nonEnqueuedJobResult = _jobUpdateConductor.Update(job);
                nonEnqueuedJobResult.ThrowIfAnyErrorsOrResultIsNull();

                return job;
            }

            job.BackgroundJobId = backgroundJobId;

            var enqueuedJob = _jobUpdateConductor.Update(job);
            enqueuedJob.ThrowIfAnyErrorsOrResultIsNull();

            Console.WriteLine($"[JobEnqueueConductor]: '{workerName}' Job Id {job.Id} Complete");

            return job;
        })
        .Result;

        public virtual bool IsValidWorkerTypeWithImplementation<TWorker>() where TWorker : IWorker
        {
            // Find all implementations of TWorker
            var workerTypes = AppDomain
                .CurrentDomain
                .GetAssemblies()
                .SelectMany((x) => x.GetTypes())
                .Where(x => typeof(TWorker).IsAssignableFrom(x)
                    && !x.IsInterface
                    && !x.IsAbstract
                )
                .ToList();

            // There can only be one valid TWorker implementation.
            if (workerTypes.IsEmpty() || workerTypes.Count > 1)
            {
                return false;
            }

            return true;
        }

        #endregion
    }
}