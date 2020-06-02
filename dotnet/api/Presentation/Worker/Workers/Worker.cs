using System;
using AndcultureCode.CSharp.Core;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using Hangfire;
using Newtonsoft.Json;
using AndcultureCode.GB.Business.Core.Interfaces.Workers;
using AndcultureCode.GB.Business.Core.Models.Jobs;

namespace AndcultureCode.GB.Presentation.Worker.Workers
{
    // TODO: Console.WriteLines should be updated after a logging strategy is complete.
    // They have been kept as a guideline for possible logging information.
    public abstract class Worker : IWorker
    {

        #region Private Members

        readonly IRepositoryReadConductor<Job> _jobReadConductor;
        readonly IRepositoryUpdateConductor<Job> _jobUpdateConductor;

        #endregion

        #region Properties

        public abstract string Name { get; }

        #endregion

        #region Private Properties

        private Job _job { get; set; }

        #endregion

        #region Constructor

        public Worker(
            IRepositoryReadConductor<Job> jobReadConductor,
            IRepositoryUpdateConductor<Job> jobUpdateConductor
        )
        {
            _jobReadConductor = jobReadConductor;
            _jobUpdateConductor = jobUpdateConductor;
        }

        #endregion

        #region Methods

        public abstract IResult<object> Action(
            Job job,
            IJobCancellationToken cancellationToken
        );

        public virtual IResult<bool> Execute(
            long jobId,
            IJobCancellationToken cancellationToken
        ) => Do<bool>.Try((r) =>
        {
            Console.WriteLine("[Worker]: ***** Starting... *****");

            cancellationToken?.ThrowIfCancellationRequested();

            var jobResult = _jobReadConductor.FindById(jobId);
            jobResult.ThrowIfAnyErrorsOrResultIsNull();

            _job = jobResult.ResultObject;

            StopExecuteIfJobIsAlreadyInProgress();

            ResetErroredOrCompletedJob();

            SetJobToInProgress();

            var actionResult = Action(_job, cancellationToken);

            // Action should only have errors if you don't want the job to be failed.
            // i.e. The job should stop gracefully, not with an exception and failed job.
            if (actionResult.HasErrors)
            {
                Console.WriteLine($"[Worker]: Job {_job.BackgroundJobId} has errors.");

                SetJobToErrored(actionResult);

                return false;
            }

            SetJobToCompleted(actionResult);

            return true;
        })
        .Catch((Exception exception, IResult<bool> result) =>
        {
            Console.WriteLine($"[Worker]: Job {_job.BackgroundJobId} has thrown an exception: {exception.Message}.");

            SetJobToErrored(exception.Message);

            throw exception;
        })
        .Result;

        #endregion

        #region Private Methods

        private void StopExecuteIfJobIsAlreadyInProgress()
        {
            if (_job.IsInProgress())
            {
                Console.WriteLine($"[Worker]: Job {_job.BackgroundJobId} is already in progress.");
                throw new Exception($"Job {_job.Id} is in progress.");
            }
        }

        private void ResetErroredOrCompletedJob()
        {
            if (_job.IsErrored() || _job.IsCompleted())
            {
                Console.WriteLine($"[Worker]: Job {_job.BackgroundJobId} is being reset to initial state.");
                _job.ResetToInitialState();

                var jobResetResult = _jobUpdateConductor.Update(_job);
                jobResetResult.ThrowIfAnyErrorsOrResultIsFalse();
            }
        }

        private void SetJobToInProgress()
        {
            _job.SetToInProgress();

            var jobStartResult = _jobUpdateConductor.Update(_job);
            jobStartResult.ThrowIfAnyErrorsOrResultIsFalse();

            Console.WriteLine($"[Worker]: Job {_job.BackgroundJobId} is in progress.");
        }

        private void SetJobToErrored<T>(IResult<T> actionResult)
        {
            SetJobToErrored(
                actionResult.ListErrors(),
                JsonConvert.SerializeObject(actionResult.ResultObject)
            );
        }

        private void SetJobToErrored(string error = null, string debugJson = null)
        {
            _job.SetToErrored(error, debugJson);

            var jobErroredResult = _jobUpdateConductor.Update(_job);
            jobErroredResult.ThrowIfAnyErrorsOrResultIsFalse();
        }

        private void SetJobToCompleted<T>(IResult<T> actionResult)
        {
            _job.SetToCompleted(actionResult.ResultObject);

            Console.WriteLine($"[Worker]: Job {_job.BackgroundJobId} has completed.");

            var jobCompleteResult = _jobUpdateConductor.Update(_job);
            jobCompleteResult.ThrowIfAnyErrorsOrResultIsFalse();
        }

        #endregion
    }
}
