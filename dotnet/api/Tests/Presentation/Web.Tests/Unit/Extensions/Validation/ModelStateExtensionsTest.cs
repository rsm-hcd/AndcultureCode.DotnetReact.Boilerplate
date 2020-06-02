using AndcultureCode.CSharp.Testing.Tests;
using Shouldly;
using System;
using Xunit;
using Xunit.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using AndcultureCode.GB.Presentation.Web.Extensions.Validation;

namespace AndcultureCode.GB.Presentation.Web.Tests.Unit.Extensions.Validation
{
    public class ModelStateExtensionsTest : BaseUnitTest, IDisposable
    {

        #region Member Variables

        const string REQUIRED_KEY = "Field.Required";
        const string REQUIRED_MESSAGE = "'Field' is required";
        const string MIN_LENGTH_KEY = "Field.Minlength";
        const string MIN_LENGTH_MESSAGE = "'Field' must be at least 5 characters long";

        #endregion

        #region Setup

        public ModelStateExtensionsTest(ITestOutputHelper output) : base(output) { }

        #endregion


        #region ToResult<T>

        [Fact]
        public void ToResult_Returns_All_Errors()
        {
            // Arrange
            var state = new ModelStateDictionary();
            state.AddModelError(REQUIRED_KEY, REQUIRED_MESSAGE);
            state.AddModelError(MIN_LENGTH_KEY, MIN_LENGTH_MESSAGE);

            // Act
            var result = state.ToResult<object>();

            // Assert
            result.ShouldNotBeNull();
            result.HasErrors.ShouldBeTrue();
            result.ErrorCount.ShouldBe(2);
            result.Errors.ShouldContain(e => e.Key == REQUIRED_KEY);
            result.Errors.ShouldContain(e => e.Message == REQUIRED_MESSAGE);
            result.Errors.ShouldContain(e => e.Key == MIN_LENGTH_KEY);
            result.Errors.ShouldContain(e => e.Message == MIN_LENGTH_MESSAGE);
            result.ResultObject.ShouldBeNull();
        }

        [Fact]
        public void ToResult_Returns_Empty_Result_When_No_Errors()
        {
            // Arrange
            var state = new ModelStateDictionary();

            // Act
            var result = state.ToResult<object>();

            // Assert
            result.ShouldNotBeNull();
            result.HasErrors.ShouldBeFalse();
            result.ErrorCount.ShouldBe(0);
            result.ResultObject.ShouldBeNull();
        }

        #endregion
    }
}
