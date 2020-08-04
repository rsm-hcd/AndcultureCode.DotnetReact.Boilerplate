using Shouldly;
using System;
using AndcultureCode.GB.Presentation.Web.Tests.Extensions;
using AndcultureCode.GB.Tests.Presentation.Web.Tests.Integration.Controllers;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.CSharp.Core.Models;
using Testing.Constants;
using LMS.Presentation.Web.Controllers.Api.V1.UserLogins;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Users;
using System.Linq;

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

        [Fact]
        public void Create_When_UserName_DoesNotExist_Then_Creates_Failed_Login_And_Returns_BadRequest()
        {
            // Arrange
            var dto = new UserLoginDto
            {
                UserName = "imaginary-user"
            };

            // Act
            var result = Sut.Create(dto).AsBadRequest<Result<Object>>();

            // Assert
            var userLogin = GBApiContext.UserLogins.FirstOrDefault();
            userLogin.ShouldNotBeNull();
            userLogin.IsSuccessful.ShouldBeFalse();
        }

        #endregion Create

        #endregion HTTP POST
    }
}
