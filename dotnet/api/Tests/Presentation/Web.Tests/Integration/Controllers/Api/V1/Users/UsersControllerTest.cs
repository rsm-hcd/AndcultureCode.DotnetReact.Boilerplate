using Shouldly;
using System;
using System.Collections.Generic;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.Users;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Users;
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
using AndcultureCode.GB.Testing.Factories.Models.Entities.Users;

namespace AndcultureCode.GB.Presentation.Web.Tests.Integration.Controllers.Api.V1.Users
{
    [Collection("ControllerIntegration")]
    public class UsersControllerTest : ControllerTest<UsersController>, IDisposable
    {
        #region Setup

        public UsersControllerTest(
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
            var user = Create<User>();

            var repositoryMock = new Mock<IRepositoryReadConductor<User>>();
            repositoryMock.SetupFindByIdReturnsBasicErrorResult(user.Id); // <---------- has errors
            RegisterDep(repositoryMock);

            MockAuthenticatedUser(user);

            // Act & Assert
            var result = Sut.Get(user.Id).AsInternalError<Result<UserDto>>();
        }

        [Fact]
        public void Get_When_Exists_Returns_Record()
        {
            // Arrange
            var user = Create<User>();
            MockAuthenticatedUser(user);

            // Act
            var result = Sut.Get(user.Id).AsOk<Result<UserDto>>();

            // Assert
            result.ShouldNotHaveErrors();
            result.ResultObject.Id.ShouldBe(user.Id);
        }

        [Fact]
        public void Get_When_Requesting_Other_User_Returns_Unauthorized()
        {
            // Arrange
            var user = Create<User>();
            MockAuthenticatedUser(user);

            var otherUser = Create<User>();

            // Act & Assert
            Sut.Get(otherUser.Id).AsUnauthorized<Result<UserDto>>();
        }

        #region Given SuperAdmin

        [Fact]
        public void Get_Given_SuperAdmin_When_NotFound_Returns_NotFound()
        {
            // Arrange
            var user = Create<User>(UserFactory.SUPER_ADMIN);
            MockAuthenticatedUser(user);
            var nonExistentUserId = user.Id + 1;

            // Act & Assert
            Sut.Get(nonExistentUserId).AsNotFound<Result<UserDto>>();
        }

        [Fact]
        public void Get_Given_SuperAdmin_When_Requesting_Other_User_Returns_Record()
        {
            // Arrange
            var user = Create<User>(UserFactory.SUPER_ADMIN);
            MockAuthenticatedUser(user);
            var otherUser = Create<User>();

            // Act
            var result = Sut.Get(otherUser.Id).AsOk<Result<UserDto>>();

            // Assert
            result.ResultObject.Id.ShouldBe(otherUser.Id);
        }

        #endregion Given SuperAdmin

        #endregion Get

        #region Index

        [Fact]
        public void Index_When_FindAll_HasErrors_Returns_InternalError()
        {
            // Arrange
            var repositoryMock = new Mock<IRepositoryReadConductor<User>>();
            repositoryMock.SetupFindAllReturnsBasicErrorResult(); // <--------- has errors
            RegisterDep(repositoryMock);

            // Act & Assert
            var result = Sut.Index().AsInternalError<Result<List<UserDto>>>();
        }

        [Fact]
        public void Index_When_NoRecords_Exist_Returns_EmptyList()
        {
            // Arrange & Act
            var result = Sut.Index().AsOk<Result<List<UserDto>>>();

            // Assert
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBeEmpty();
        }

        [Fact]
        public void Index_When_Valid_Request_Returns_Records()
        {
            // Arrange
            var user = Create<User>();

            // Act
            var result = Sut.Index().AsOk<Result<List<UserDto>>>();

            // Assert
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldContain(e => e.Id == user.Id);
        }

        #endregion Index

        #endregion HTTP GET
    }
}
