using System;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.CSharp.Testing.Extensions;
using AndcultureCode.GB.Business.Core.Enumerations;
using AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.Jobs;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Jobs;
using AndcultureCode.GB.Presentation.Web.Tests.Extensions;
using AndcultureCode.GB.Tests.Presentation.Web.Tests.Integration.Controllers;
using Shouldly;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.GB.Business.Core.Interfaces.Providers.Worker;
using Moq;
using System.Linq.Expressions;
using Bogus;
using AndcultureCode.GB.Business.Core.Interfaces.Workers;

namespace AndcultureCode.GB.Presentation.Web.Tests.Integration.Controllers.Api.V1.Jobs
{
    [Collection("ControllerIntegration")]
    public class JobsControllerTest : ControllerTest<JobsController>, IDisposable
    {
        #region Properties
        private Faker Fake = new Faker();

        #endregion

        #region Setup

        public JobsControllerTest(
            ControllerFixture fixture,
            ITestOutputHelper output
        ) : base(fixture, output)
        {
        }

        #endregion Setup

        #region Teardown

        public override void Dispose() { }

        #endregion Teardown

        #region HTTP POST

        #region Create

        // [Fact(Skip = "TODO")]
        // public void Create_With_Valid_Job_Enqueues_Job_Returns_Created()
        // {
        //     // Arrange
        //     var dto = new JobDto
        //     {
        //         WorkerName = "Publication Worker"
        //     };

        //     // Mock out provider that call background job processing library.
        //     var jobId = Fake.Random.Guid().ToString();
        //     var workerProviderMock = new Mock<IWorkerProvider>();
        //     workerProviderMock
        //         .Setup((e) => e.Enqueue<ITestStubWorker>(It.IsAny<Expression<Action<ITestStubWorker>>>()))
        //         .Returns(jobId);
        //     RegisterDep(workerProviderMock);

        //     // Act
        //     var result = Sut.Create(dto).AsCreated<Result<JobDto>>();

        //     // Assert
        //     result.ShouldNotHaveErrors();
        //     result.ResultObject.ShouldNotBeNull();

        //     var resultObject = result.ResultObject;

        //     resultObject.ShouldSatisfyAllConditions(
        //         () => resultObject.DebugJson.ShouldBeNull(),
        //         () => resultObject.Error.ShouldBeNull(),
        //         () => resultObject.EndedOn.ShouldNotBeNull(),
        //         () => resultObject.StartedOn.ShouldNotBeNull(),
        //         () => resultObject.StartedById.ShouldNotBeNull(),
        //         () => resultObject.Status.ShouldBe(JobStatus.Completed),
        //         () => resultObject.WorkerName.ShouldNotBeNull(),
        //         () => resultObject.WorkerArgs.ShouldNotBeNull()
        //     );
        // }

        #endregion Create

        #endregion HTTP POST
    }
}
