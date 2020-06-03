using System;
using FluentValidation.TestHelper;
using AndcultureCode.GB.Presentation.Web.Validators.Users;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Presentation.Web.Tests.Unit.Validators.Users
{
    public class UserLoginValidatorTest : ApiUnitTest, IDisposable
    {
        #region Member Variables

        UserLoginValidator _sut;

        #endregion Member Variables

        #region Setup

        public UserLoginValidatorTest(ITestOutputHelper output) : base(output)
        {
            _sut = new UserLoginValidator();
        }

        #endregion Setup

        #region Password

        [Fact]
        public void Password_ShouldHaveError_When_Empty()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.Password, string.Empty);
        }

        [Fact]
        public void Password_ShouldNotHaveError_With_Valid_Password()
        {
            // Arrange
            var password = new Bogus.DataSets.Internet().Password();

            // Act & Assert
            _sut.ShouldNotHaveValidationErrorFor(m => m.Password, password);
        }

        #endregion Password

        #region Username

        [Fact]
        public void Username_ShouldHaveError_When_Empty()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.UserName, string.Empty);
        }

        [Fact]
        public void Username_ShouldNotHaveError_With_Valid_Password()
        {
            // Arrange
            var username = new Bogus.DataSets.Internet().UserName();

            // Act & Assert
            _sut.ShouldNotHaveValidationErrorFor(m => m.UserName, username);
        }

        #endregion Username
    }
}
