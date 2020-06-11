using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.CSharp.Testing.Extensions;
using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.CSharp.Testing.Tests;
using AndcultureCode.GB.Business.Conductors.Domain.Jobs;
using AndcultureCode.GB.Business.Core.Models.Jobs;
using Xunit;
using Xunit.Abstractions;
using Moq;
using Bogus;
using Shouldly;
using AndcultureCode.GB.Business.Core.Interfaces.Workers;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Jobs;
using AndcultureCode.CSharp.Testing.Extensions.Mocks.Conductors;
using System;
using Microsoft.Extensions.Localization;
using AndcultureCode.CSharp.Core.Interfaces.Providers.Worker;

namespace AndcultureCode.GB.Business.Conductors.Tests.Integration.Jobs
{
    public class JobEnqueueConductorTest : BaseUnitTest
    {
        #region Properties

        private Faker Fake = new Faker();

        #endregion Properties

        #region Setup

        public JobEnqueueConductorTest(ITestOutputHelper output) : base(output) { }

        #endregion Setup

        #region Mocks

        private IJobEnqueueConductor SetupSut(
            Mock<IRepositoryCreateConductor<Job>> jobCreateConductor = null,
            Mock<IRepositoryUpdateConductor<Job>> jobUpdateConductor = null,
            Mock<IServiceProvider> serviceProvider = null,
            IEnumerable<IWorker> workers = null,
            Mock<IWorkerProvider> workerProvider = null
        )
        {
            return new JobEnqueueConductor(
                jobCreateConductor: jobCreateConductor?.Object,
                jobUpdateConductor: jobUpdateConductor?.Object,
                localizer: Mock.Of<IStringLocalizer>(),
                serviceProvider: serviceProvider?.Object,
                workers: workers,
                workerProvider: workerProvider?.Object
            );
        }

        #endregion Mocks

        #region Interface

        public interface ITestImplementation : IWorker { }

        #endregion Interface

        #region Enqueue<TWorker>(workerArgs)

        [Fact(Skip = "Broken due to refactor.")]
        public void Enqueue_With_Valid_Worker_Creates_Job_With_Initial_State()
        {
            // Arrange
            var args = new List<object>();
            var job = new Job();
            var startedById = Fake.Random.Long();

            var createdJob = new Job();

            var workerMock = new Mock<IWorker>();

            var workersList = new List<IWorker> { workerMock.Object };
            IEnumerable<IWorker> workers = workersList;

            var jobCreateConductorMock = new Mock<IRepositoryCreateConductor<Job>>();
            jobCreateConductorMock
                .Setup(e => e.Create(
                    It.IsAny<Job>(),
                    It.IsAny<long?>()
                ))
                .Callback<Job, long?>((jobArg, id) => { createdJob = jobArg; })
                .Returns(new Result<Job> { ResultObject = createdJob });

            var sut = SetupSut(
                jobCreateConductor: jobCreateConductorMock,
                jobUpdateConductor: null,
                workers: workers,
                workerProvider: null
            );

            // Act
            var result = sut.Enqueue<IWorker>(args, startedById);

            // Assert
            jobCreateConductorMock
                .Verify(e => e.Create(
                    It.IsAny<Job>(),
                    It.IsAny<long?>()
                ), Times.Once());

            createdJob.IsInitialState().ShouldBeTrue();
        }

        [Fact(Skip = "Broken due to refactor.")]
        public void Enqueue_With_Invalid_Worker_Returns_Errored_Job()
        {
            // Arrange
            var args = new List<object>();
            var job = new Job();
            var startedById = Fake.Random.Long();

            var jobCreateConductorMock = new Mock<IRepositoryCreateConductor<Job>>();
            jobCreateConductorMock
                .Setup(e => e.Create(
                    It.IsAny<Job>(),
                    It.IsAny<long?>()
                ))
                .ReturnsGivenResult(job);

            var jobEnqueueConductorMock = new Mock<JobEnqueueConductor>(
                jobCreateConductorMock.Object,
                null,
                null,
                null
            );

            jobEnqueueConductorMock.CallBase = true;
            jobEnqueueConductorMock
                .Setup(e => e.IsValidWorkerTypeWithImplementation<ITestImplementation>())
                .Returns(false);

            // Act
            var result = jobEnqueueConductorMock
                .Object
                .Enqueue<ITestImplementation>(args, startedById);

            // Assert
            result.ShouldHaveErrorsFor(JobEnqueueConductor.ERROR_WORKER_NOT_FOUND);
            result.ResultObject.ShouldNotBeNull();
            result.ResultObject.ShouldBeOfType<Job>();
            result.ResultObject.IsErrored().ShouldBeTrue();
            result.ResultObject.StartedById.ShouldBe(startedById);
        }

        #endregion Enqueue<TWorker>(workerArgs)
    }
}
