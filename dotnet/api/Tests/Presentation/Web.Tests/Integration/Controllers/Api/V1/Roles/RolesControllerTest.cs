using Shouldly;
using System;
using System.Collections.Generic;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.Roles;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Roles;
using AndcultureCode.GB.Presentation.Web.Tests.Extensions;
using AndcultureCode.GB.Tests.Presentation.Web.Tests.Integration.Controllers;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.CSharp.Testing.Extensions;
using Moq;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.CSharp.Testing.Extensions.Mocks.Conductors;
using AndcultureCode.GB.Testing.Constants;

namespace AndcultureCode.GB.Presentation.Web.Tests.Integration.Controllers.Api.V1.Roles
{
    [Collection("ControllerIntegration")]
    public class RolesControllerTest : ControllerTest<RolesController>, IDisposable
    {
        #region Setup

        public RolesControllerTest(
            ControllerFixture fixture,
            ITestOutputHelper output
        ) : base(fixture, output)
        {
        }

        #endregion Setup

        #region HTTP GET

        #region Get

        [Fact]
        public void Get_When_FindById_HasErrors_Returns_InternalError()
        {
            // Arrange
            var repositoryMock = new Mock<IRepositoryReadConductor<Role>>();
            repositoryMock.SetupFindByIdReturnsBasicErrorResult(10);
            RegisterDep(repositoryMock);

            // Act & Assert
            var result = Sut.Get(10).AsInternalError<Result<RoleDto>>();
        }

        [Fact]
        public void Get_When_NotFound_Returns_NotFound()
        {
            Sut.Get(404).AsNotFound<Result<RoleDto>>();
        }

        [Fact]
        public void Get_When_Exists_Returns_Record()
        {
            // Arrange
            var role = Create<Role>();

            // Act
            var result = Sut.Get(role.Id).AsOk<Result<RoleDto>>();

            // Assert
            result.ShouldNotHaveErrors();
            result.ResultObject.Id.ShouldBe(role.Id);
        }

        #endregion Get

        #region Index

        [Fact]
        public void Index_When_FindAll_HasErrors_Returns_InternalError()
        {
            // Arrange
            var repositoryMock = new Mock<IRepositoryReadConductor<Role>>();
            repositoryMock.SetupFindAllReturnsBasicErrorResult();
            RegisterDep(repositoryMock);

            // Act & Assert
            var result = Sut.Index().AsInternalError<Result<List<RoleDto>>>();
        }

        [Fact]
        public void Index_When_NoRecords_Exist_Returns_EmptyList()
        {
            // Act & Arrange
            var result = Sut.Index().AsOk<Result<List<RoleDto>>>();

            // Assert
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeEmpty();
        }

        [Fact]
        public void Index_When_Valid_Request_Returns_Records()
        {
            // Arrange
            var record = Create<Role>();

            // Act
            var result = Sut.Index().AsOk<Result<List<RoleDto>>>();

            // Assert
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldContain(e => e.Id == record.Id);
        }

        #endregion Index

        #endregion HTTP GET
    }
}
