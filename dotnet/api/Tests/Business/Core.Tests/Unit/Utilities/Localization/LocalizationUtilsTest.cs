using System;
using System.Collections.Generic;
using AndcultureCode.CSharp.Testing.Tests;
using AndcultureCode.GB.Business.Core.Interfaces.Localization;
using AndcultureCode.GB.Business.Core.Models.Localization;
using AndcultureCode.GB.Business.Core.Tests.Unit.Stubs;
using AndcultureCode.GB.Business.Core.Utilities.Localization;
using AndcultureCode.GB.Business.Core.Utilities.Security;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Utilities.Localization
{
    public class LocalizationUtilsTest : BaseUnitTest
    {
        #region Setup

        public LocalizationUtilsTest(ITestOutputHelper output) : base(output) { }

        #endregion Setup

        #region Cultures

        [Fact]
        public void Cultures_DoesNot_Return_AbstractClasses()
        {
            // Arrange & Act
            var result = LocalizationUtils.Cultures;

            // Assert
            result.ShouldNotContain(e => e.GetType().Name == nameof(AbstractCultureStub));
        }

        [Fact]
        public void Cultures_DoesNot_Return_Interfaces()
        {
            // Arrange & Act
            var result = LocalizationUtils.Cultures;

            // Assert
            result.ShouldNotContain(e => e.GetType().Name == nameof(ICultureStub));
        }

        [Fact]
        public void Cultures_Returns_Concrete_ImplemenationsOf_ICulture()
        {
            // Arrange & Act
            var result = LocalizationUtils.Cultures;

            // Assert
            result.Count.ShouldBeGreaterThan(0);
            result.ShouldContain(e => e.GetType().Name == nameof(CultureStub));
        }

        #endregion Cultures

        #region CultureInfos

        [Fact]
        public void CultureInfos_Returns_Concrete_ImplemenationsOf_ICulture_As_CultureInfos()
        {
            // Arrange & Act
            var result = LocalizationUtils.CultureInfos;

            // Assert
            result.Count.ShouldBeGreaterThan(0);
            result.ShouldContain(e => e.Name == new CultureStub().Code);
        }

        #endregion CultureInfos

        #region DefaultCulture

        [Fact]
        public void DefaultCulture_DoesNot_Return_Null()
        {
            // Act
            var result = LocalizationUtils.DefaultCulture;

            // Assert
            result.ShouldNotBeNull();
            result.IsDefault.ShouldBeTrue();
        }

        #endregion DefaultCulture

        #region DefaultCultureCode

        [Fact]
        public void DefaultCultureCode_DoesNot_Return_Null()
        {
            LocalizationUtils.DefaultCultureCode.ShouldNotBeNull();
        }

        [Fact]
        public void DefaultCultureCode_Returns_Correct_RFC4646_Format()
        {
            LocalizationUtils.DefaultCultureCode.ShouldMatch("[a-z]{2}-[A-Z]{2}");
        }

        #endregion DefaultCultureCode

        #region DefaultCultureInfo

        [Fact]
        public void DefaultCultureInfo_DoesNot_Return_Null()
        {
            LocalizationUtils.DefaultCultureInfo.ShouldNotBeNull();
        }

        #endregion DefaultCultureInfo

        #region CultureByCode

        [Fact]
        public void CultureByCode_Given_CultureCode_DoesNotExist_Returns_Null()
        {
            LocalizationUtils.CultureByCode("404").ShouldBeNull();
        }

        [Fact]
        public void CultureByCode_Given_CultureCode_Exists_Returns_Culture()
        {
            // Arrange
            var expected = new CultureStub().Code;

            // Act
            var result = LocalizationUtils.CultureByCode(expected);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldBeOfType<CultureStub>();
            result.Code.ShouldBe(expected);
        }

        #endregion CultureByCode

        #region CultureCodes

        [Fact]
        public void CultureCodes_Without_Arguments_Returns_Comma_Delimited_Codes()
        {
            // Arrange
            var expected = new CultureStub().Code;

            // Act
            var result = LocalizationUtils.CultureCodes();

            // Assert
            result.ShouldNotBeNull();
            result.ShouldContain(expected);
            result.ShouldContain(", ");
        }

        [Fact]
        public void CultureCodes_Given_Delimiter_IsNull_Throws_Exception()
        {
            Should.Throw<Exception>(() =>
            {
                LocalizationUtils.CultureCodes(null);
            });
        }

        [Theory]
        [InlineData("-")]
        [InlineData("- ")]
        [InlineData("--")]
        [InlineData("- -")]
        [InlineData(" -")]
        [InlineData(" - ")]
        public void CultureCodes_Given_Delimiter_IsHyphen_Throws_Exception(string hyphenatedDelimiter)
        {
            Should.Throw<Exception>(() =>
            {
                LocalizationUtils.CultureCodes(hyphenatedDelimiter);
            });
        }

        [Fact]
        public void CultureCodes_Given_Delimiter_IsEmptyString_Throws_Exception()
        {
            Should.Throw<Exception>(() =>
            {
                LocalizationUtils.CultureCodes("");
            });
        }

        [Theory]
        [InlineData(" ")]
        [InlineData("|")]
        [InlineData(".")]
        [InlineData("@")]
        public void CultureCodes_Given_Custom_Delimiter_Returns_Custom_Delimited_Codes(string expectedDelimiter)
        {
            // Arrange
            var expectedCode = new CultureStub().Code;

            // Act
            var result = LocalizationUtils.CultureCodes(expectedDelimiter);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldContain(expectedCode);
            result.ShouldContain(expectedDelimiter);
        }

        #endregion CultureCodes

        #region CultureExists

        [Fact]
        public void CultureExists_When_CultureCode_DoesNotExist_Returns_False()
        {
            LocalizationUtils.CultureExists("404").ShouldBeFalse();
        }

        [Fact]
        public void CultureExists_When_CultureCode_Exists_Returns_True()
        {
            LocalizationUtils.CultureExists(new CultureStub().Code).ShouldBeTrue();
        }

        #endregion CultureExists
    }
}
