using AndcultureCode.CSharp.Core.Models;
using Microsoft.Extensions.Hosting;
using Moq;
using AndcultureCode.GB.Business.Core.Models.Configuration;
using AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.SystemSettings;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.SystemSettings;
using AndcultureCode.GB.Presentation.Web.Tests.Extensions;
using AndcultureCode.GB.Tests.Presentation.Web.Tests.Integration.Controllers;
using Shouldly;
using System;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.GB.Testing.Constants;

namespace AndcultureCode.GB.Presentation.Web.Tests.Integration.Controllers.Api.V1.SystemSettings
{
    [Collection("ControllerIntegration")]
    public class SystemSettingsControllerTest : ControllerTest<SystemSettingsController>, IDisposable
    {
        #region Setup

        public SystemSettingsControllerTest(
            ControllerFixture fixture,
            ITestOutputHelper output)
        : base(fixture, output)
        {
        }

        #endregion Setup

        #region HTTP GET

        #region Index

        [Fact]
        public void Index_When_NonProduction_Environment_Returns_Record()
        {
            // Arrange
            var expectedEnvironment = "Testing";
            var hostingEnvironmentMock = new Mock<IHostEnvironment>();
            hostingEnvironmentMock.SetupGet(e => e.EnvironmentName).Returns(expectedEnvironment);
            RegisterDep(hostingEnvironmentMock);

            // Arrange & Act
            var result = Sut.Index().AsOk<Result<SystemSettingsDto>>().ResultObject;

            // Assert
            result.ShouldNotBeNull();
            result.DatabaseName.ShouldNotBeNull();
            result.EnvironmentName.ShouldBe(expectedEnvironment);
            result.MachineName.ShouldBe(Environment.MachineName);
        }

        [Fact]
        public void Index_When_Production_Environment_Return_Record_Without_NonProduction_Properties()
        {
            // Arrange
            var hostingEnvironmentMock = new Mock<IHostEnvironment>();
            hostingEnvironmentMock.SetupGet(e => e.EnvironmentName).Returns("Production");
            RegisterDep(hostingEnvironmentMock);

            // Arrange & Act
            var result = Sut.Index().AsOk<Result<SystemSettingsDto>>().ResultObject;

            // Assert
            result.ShouldNotBeNull();
            result.DatabaseName.ShouldBeNull();
        }

        #endregion Index

        #endregion HTTP GET
    }
}
