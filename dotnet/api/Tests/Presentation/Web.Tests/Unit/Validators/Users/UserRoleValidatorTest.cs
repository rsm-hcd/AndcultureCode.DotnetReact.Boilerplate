using FluentValidation.TestHelper;
using AndcultureCode.GB.Presentation.Web.Validators.Users;
using System;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Presentation.Web.Tests.Unit.Validators.Users
{
    public class UserRoleValidatorTest : ApiUnitTest, IDisposable
    {
        #region Member Variables

        UserRoleValidator _sut;

        #endregion Member Variables


        #region Setup

        public UserRoleValidatorTest(ITestOutputHelper output) : base(output)
        {
            _sut = new UserRoleValidator();
        }

        #endregion Setup


        #region RoleId

        [Fact]
        public void RoleId_ShouldHaveError_When_0()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.RoleId, 0);
        }

        [Fact]
        public void RoleId_ShouldNotHaveError_When_GreaterThan_0()
        {
            for (var i = 1; i <= 100; i++)
            {
                _sut.ShouldNotHaveValidationErrorFor(m => m.RoleId, i);
            }
        }

        #endregion RoleId


        #region UserId

        [Fact]
        public void UserId_ShouldHaveError_When_0()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.UserId, 0);
        }

        [Fact]
        public void UserId_ShouldNotHaveError_When_GreaterThan_0()
        {
            for (var i = 1; i <= 100; i++)
            {
                _sut.ShouldNotHaveValidationErrorFor(m => m.UserId, i);
            }
        }

        #endregion UserId

    }
}
