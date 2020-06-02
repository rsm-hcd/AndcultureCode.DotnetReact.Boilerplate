using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.CSharp.Testing.Tests;
using AndcultureCode.CSharp.Testing.Extensions.Mocks.Conductors;
using Moq;
using Shouldly;
using AndcultureCode.GB.Business.Core.Models.Jobs;
using Xunit;
using Xunit.Abstractions;
using WorkerClass = AndcultureCode.GB.Presentation.Worker.Workers.Worker;
using AndcultureCode.CSharp.Core.Interfaces;
using System.Linq.Expressions;
using System;
using AndcultureCode.CSharp.Core;
using Bogus;
using AndcultureCode.CSharp.Testing.Extensions.Mocks;
using Hangfire;

namespace AndcultureCode.GB.Presentation.Worker.Tests.Unit
{
    public class WorkerTest : BaseUnitTest
    {
        #region Properties
        private Faker Fake = new Faker();

        #endregion

        #region Setup

        public WorkerTest(ITestOutputHelper output) : base(output)
        {
        }

        #endregion

        #region Class Implementation

        public class WorkerImplementation : WorkerClass
        {
            readonly Expression<Func<Job, bool>> _actionExpression;

            public override string Name { get; } = "Worker Implementation";

            public WorkerImplementation(
                IRepositoryReadConductor<Job> jobReadConductor,
                IRepositoryUpdateConductor<Job> jobUpdateConductor,
                Expression<Func<Job, bool>> actionExpression
            ) : base(jobReadConductor, jobUpdateConductor)
            {
                _actionExpression = actionExpression;
            }
            public override IResult<object> Action(Job job, IJobCancellationToken cancelationToken) => Do<object>.Try((r) =>
            {
                var func = _actionExpression.Compile();
                return func(job);
            })
            .Result;
        }

        #endregion

        #region Execute (jobId)

        [Fact(Skip = "Broken due to refactor.")]
        public void Execute_When_Action_Returns_True_And_Job_Update_Returns_True()
        {
            // Arrange
            var job = new Job
            {
                Id = Fake.Random.Long()
            };

            var jobReadConductorMock = new Mock<IRepositoryReadConductor<Job>>();
            jobReadConductorMock
                .Setup((e => e.FindById(It.IsAny<long>())))
                .ReturnsGivenResult(job);

            var jobUpdateConductorMock = new Mock<IRepositoryUpdateConductor<Job>>();
            jobUpdateConductorMock
                .Setup((e => e.Update(It.IsAny<Job>(), null)))
                .ReturnsGivenResult(true);

            var worker = new WorkerImplementation(
                jobReadConductorMock.Object,
                jobUpdateConductorMock.Object,
                (x) => true
            );

            // Act
            var result = worker.Execute(job.Id, null);

            // Assert
            result.ResultObject.ShouldBeTrue();
        }

        [Fact(Skip = "Does NOT work with exception handling.")]
        public void Execute_Throws_Error_When_Job_Cannot_Be_Found()
        {
            // Arrange
            var jobId = Fake.Random.Long();

            var jobReadConductorMock = new Mock<IRepositoryReadConductor<Job>>();
            jobReadConductorMock
                .Setup((e => e.FindById(It.IsAny<long>())))
                .ReturnsGivenResult(null);

            var worker = new WorkerImplementation(
                jobReadConductor: jobReadConductorMock.Object,
                jobUpdateConductor: null,
                actionExpression: null
            );

            // Act
            var ex = Record.Exception(() => worker.Execute(jobId, null));

            // Assert
            ex.ShouldNotBeNull();
        }

        [Fact(Skip = "Does NOT work with exception handling.")]
        public void Execute_Throws_Error_When_Job_Read_Conductor_Returns_Error()
        {
            // Arrange
            var jobId = Fake.Random.Long();

            var jobReadConductorMock = new Mock<IRepositoryReadConductor<Job>>();
            jobReadConductorMock
                .Setup((e => e.FindById(It.IsAny<long>())))
                .ReturnsBasicErrorResult();

            var worker = new WorkerImplementation(
                jobReadConductor: jobReadConductorMock.Object,
                jobUpdateConductor: null,
                actionExpression: null
            );

            // Act
            var ex = Record.Exception(() => worker.Execute(jobId, null));

            // Assert
            ex.ShouldNotBeNull();
        }

        #endregion

    }
}
