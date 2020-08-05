using Shouldly;
using System;
using AndcultureCode.GB.Presentation.Web.Tests.Extensions;
using AndcultureCode.GB.Tests.Presentation.Web.Tests.Integration.Controllers;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.GB.Testing.Constants;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Users;
using System.Linq;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Domain.Users;
using AndcultureCode.CSharp.Testing.Extensions;
using AndcultureCode.GB.Business.Conductors.Domain.UserLogins;
using AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.UserLogins;

namespace AndcultureCode.GB.Presentation.Web.Tests.Integration.Controllers.Api.V1.Roles
{
    /// <summary>
    /// Unskip on project versions of boilerplate. Skipped until can setup EF in-memory
    /// so the integration tests can be run on Travis CI.
    /// </summary>
    [Trait(Trait.CATEGORY, TraitCategory.SKIP_CI)]
    [Collection("ControllerIntegration")]
    public class UserLoginsControllerTest : ControllerTest<UserLoginsController>, IDisposable
    {
        #region Setup

        public UserLoginsControllerTest(
            ControllerFixture fixture,
            ITestOutputHelper output
        ) : base(fixture, output)
        {
        }

        #endregion Setup

        #region HTTP POST

        #region Create

        private User CreateUser(string password)
        {
            var user = Build<User>();

            GetDep<IUserLoginConductor<User>>().SetPassword(user, password);
            GBApiContext.Users.Add(user);
            GBApiContext.SaveChanges();

            return user;
        }

        [Fact]
        public void Create_When_UserName_DoesNotExist_Then_Creates_Failed_Login_And_Returns_BadRequest()
        {
            // Arrange
            var dto = new UserLoginDto
            {
                UserName = "imaginary-user" // <--------------------
            };

            // Act
            var result = Sut.Create(dto).AsBadRequest<Result<Object>>();

            // Assert
            var userLogin = GBApiContext.UserLogins.FirstOrDefault();
            userLogin.ShouldNotBeNull();
            userLogin.IsSuccessful.ShouldBeFalse();
            result.ShouldHaveErrorsFor(UserLoginConductor<User>.ERROR_INVALID_CREDENTIALS);
        }

        [Fact]
        public void Create_When_UserName_Exists_When_Incorrect_Password_Then_Creates_Failed_Login_And_Returns_BadRequest()
        {
            // Arrange
            var user = CreateUser(password: "actual-password");
            var dto = new UserLoginDto
            {
                Password = "incorrect-password", // <--------------------
                UserName = user.UserName
            };

            // Act
            var result = Sut.Create(dto).AsBadRequest<Result<Object>>();

            // Assert
            var userLogin = GBApiContext.UserLogins.FirstOrDefault();
            userLogin.ShouldNotBeNull();
            userLogin.IsSuccessful.ShouldBeFalse();
            result.ShouldHaveErrorsFor(UserLoginConductor<User>.ERROR_INVALID_CREDENTIALS);
        }

        [Fact]
        public void Create_When_UserName_And_Password_Correct_Then_Creates_Successful_Login_And_Returns_Created()
        {
            // Arrange
            var password = "password";
            var user = CreateUser(password);
            var dto = new UserLoginDto
            {
                Password = password,
                UserName = user.UserName
            };

            // Act
            var result = Sut.Create(dto).Result.AsCreated<Result<UserLoginDto>>();

            // Assert
            var userLogin = GBApiContext.UserLogins.FirstOrDefault();
            userLogin.ShouldNotBeNull();
            userLogin.IsSuccessful.ShouldBeTrue();
        }

        #endregion Create

        #endregion HTTP POST
    }
}
