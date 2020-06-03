using System;
using FluentValidation.TestHelper;
using AndcultureCode.GB.Presentation.Web.Validators.Users;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Presentation.Web.Tests.Unit.Validators.Users
{
    public class UserValidatorTest : ApiUnitTest, IDisposable
    {

        #region Member Variables

        UserValidator _sut;

        #endregion

        #region Constructor

        public UserValidatorTest(ITestOutputHelper output) : base(output)
        {
            _sut = new UserValidator();
        }

        #endregion Constructor

        #region Email

        [Fact]
        public void UserValidator_When_Email_IsEmpty_Then_Returns_WithError()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.Email, string.Empty);
        }

        #endregion Email

        #region UserName

        [Fact]
        public void UserValidator_When_UserName_IsEmpty_Then_Returns_WithError()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.UserName, string.Empty);
        }

        #endregion UserName

        #region FirstName
        [Fact]
        public void UserValidator_When_FirstName_IsEmpty_Then_Returns_WithError()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.FirstName, string.Empty);
        }

        #endregion FirstName

        #region LastName

        [Fact]
        public void UserValidator_When_LastName_IsEmpty_Then_Returns_WithError()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.LastName, string.Empty);
        }

        #endregion LastName
    }
}