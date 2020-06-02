using AndcultureCode.GB.Business.Core.Extensions;
using Shouldly;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;
using System;
using AndcultureCode.CSharp.Testing.Extensions;
using AndcultureCode.CSharp.Core.Models;
using Moq;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using AndcultureCode.CSharp.Core.Enumerations;
using System.Collections.Generic;
using AndcultureCode.CSharp.Extensions;
using AndcultureCode.GB.Business.Core.Constants.Errors;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Extensions
{
    public class IResultExtensionsTest : CodesApiUnitTest
    {
        #region Setup

        public IResultExtensionsTest(ITestOutputHelper output) : base(output) { }

        #endregion Setup


        #region AddError(localizer, type, key, arguments)

        [Fact]
        public void AddError_Localizer_And_ErrorType_Overload_When_No_Translation_Exists_Adds_Untranslated_Error()
        {
            // Arrange
            var destinationResult = new Result<object>();
            var expectedKey = Random.String();
            var expectedMessage = Random.String();
            var expectedType = new List<ErrorType> { ErrorType.Error, ErrorType.ValidationError }.PickRandom();
            var localizer = Mock.Of<IStringLocalizer>();

            // Act
            destinationResult.AddError(localizer, expectedType, expectedKey);

            // Assert
            destinationResult.Errors.ShouldContain(e =>
                e.ErrorType == expectedType &&
                e.Key == expectedKey &&
                e.Message == null // <---- added message with null
            );
        }

        [Fact]
        public void AddError_Localizer_And_ErrorType_Overload_Adds_Translated_Error()
        {
            // Arrange
            var destinationResult = new Result<object>();
            var expectedKey = Random.String();
            var expectedMessage = Random.String();
            var expectedType = new List<ErrorType> { ErrorType.Error, ErrorType.ValidationError }.PickRandom();

            var localizedString = new LocalizedString(expectedKey, expectedMessage);
            var localizer = Mock.Of<IStringLocalizer>(e => e[expectedKey, It.IsAny<object[]>()] == localizedString);

            // Act
            destinationResult.AddError(localizer, expectedType, expectedKey);

            // Assert
            destinationResult.Errors.ShouldContain(e =>
                e.ErrorType == expectedType &&
                e.Key == expectedKey &&
                e.Message == expectedMessage
            );
        }

        #endregion AddError(localizer, type, key, arguments)

        #region AddError(localizer, key, arguments)

        [Fact]
        public void AddError_Localizer_Without_ErrorType_Overload_When_No_Translation_Exists_Adds_Untranslated_Error()
        {
            // Arrange
            var destinationResult = new Result<object>();
            var expectedKey = Random.String();
            var expectedMessage = Random.String();
            var localizer = Mock.Of<IStringLocalizer>();

            // Act
            destinationResult.AddError(localizer, expectedKey);

            // Assert
            destinationResult.Errors.ShouldContain(e =>
                e.ErrorType == ErrorType.Error && // <---- Error
                e.Key == expectedKey &&
                e.Message == null // <---- added message with null
            );
        }

        [Fact]
        public void AddError_Localizer_Without_ErrorType_Overload_Adds_Translated_Error()
        {
            // Arrange
            var destinationResult = new Result<object>();
            var expectedKey = Random.String();
            var expectedMessage = Random.String();

            var localizedString = new LocalizedString(expectedKey, expectedMessage);
            var localizer = Mock.Of<IStringLocalizer>(e => e[expectedKey, It.IsAny<object[]>()] == localizedString);

            // Act
            destinationResult.AddError(localizer, expectedKey);

            // Assert
            destinationResult.Errors.ShouldContain(e =>
                e.ErrorType == ErrorType.Error && // <---- Error
                e.Key == expectedKey &&
                e.Message == expectedMessage
            );
        }

        #endregion AddError(localizer, key, arguments)

        #region AddValidationError(localizer, key, arguments)

        [Fact]
        public void AddValidationError_Localizer_Without_ErrorType_Overload_When_No_Translation_Exists_Adds_Untranslated_ValidationError()
        {
            // Arrange
            var destinationResult = new Result<object>();
            var expectedKey = Random.String();
            var expectedMessage = Random.String();
            var localizer = Mock.Of<IStringLocalizer>();

            // Act
            destinationResult.AddValidationError(localizer, expectedKey);

            // Assert
            destinationResult.Errors.ShouldContain(e =>
                e.ErrorType == ErrorType.ValidationError && // <---- ValidationError
                e.Key == expectedKey &&
                e.Message == null // <---- added message with null
            );
        }

        [Fact]
        public void AddValidationError_Localizer_Without_ErrorType_Overload_Adds_Translated_ValidationError()
        {
            // Arrange
            var destinationResult = new Result<object>();
            var expectedKey = Random.String();
            var expectedMessage = Random.String();

            var localizedString = new LocalizedString(expectedKey, expectedMessage);
            var localizer = Mock.Of<IStringLocalizer>(e => e[expectedKey, It.IsAny<object[]>()] == localizedString);

            // Act
            destinationResult.AddValidationError(localizer, expectedKey);

            // Assert
            destinationResult.Errors.ShouldContain(e =>
                e.ErrorType == ErrorType.ValidationError && // <---- ValidationError
                e.Key == expectedKey &&
                e.Message == expectedMessage
            );
        }

        #endregion AddValidationError(localizer, key, arguments)

        #region HasUserConfigurationErrors

        [Fact]
        public void HasUserConfigurationErrors_When_Errors_Empty_Returns_False()
        {
            // Arrange
            var sut = new Result<object>();

            // Act
            var result = sut.HasUserConfigurationErrors();

            // Assert
            result.ShouldBeFalse();
        }

        [Fact]
        public void HasUserConfigurationErrors_Has_Error_Key_Not_In_UserConfigurationErrorKeys_Returns_False()
        {
            // Arrange
            var sut = new Result<object>(
                errorKey: Random.String(),
                errorMessage: Random.String()
            );

            // Act
            var result = sut.HasUserConfigurationErrors();

            // Assert
            result.ShouldBeFalse();
        }

        [Fact]
        public void HasUserConfigurationErrors_Has_Error_Key_In_UserConfigurationErrorKeys_Returns_True()
        {
            // Arrange
            var errorKey = typeof(UserConfigurationErrorKeys).GetPublicConstantValues<string>().PickRandom();
            var sut = new Result<object>(
                errorKey: errorKey,
                errorMessage: Random.String()
            );

            // Act
            var result = sut.HasUserConfigurationErrors();

            // Assert
            result.ShouldBeTrue();
        }

        #endregion HasUserConfigurationErrors
    }
}