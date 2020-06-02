using System;
using System.Collections.Generic;
using AndcultureCode.CSharp.Testing.Tests;
using AndcultureCode.GB.Business.Core.Utilities.Localization;
using AndcultureCode.GB.Business.Core.Utilities.Security;
using Shouldly;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.GB.Business.Core.Tests.Unit.Stubs;
using AndcultureCode.GB.Business.Core.Cultures;
using AndcultureCode.GB.Business.Core.Extensions;
using AndcultureCode.GB.Business.Core.Interfaces.Localization;
using System.Globalization;
using AndcultureCode.GB.Business.Core.Models.Localization;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Utilities.Localization
{
    public partial class ICultureExtensionsTest : BaseUnitTest
    {
        #region Setup

        public ICultureExtensionsTest(ITestOutputHelper output) : base(output) { }

        #endregion Setup

        #region Default

        [Fact]
        public void Default_Given_Cultures_Without_Default_Throws_Exception()
        {
            Should.Throw<ArgumentException>(() =>
            {
                new List<ICulture> { new CultureStub() }.Default();
            });
        }

        [Fact]
        public void Default_Given_Cultures_With_Multiple_Defaults_Throws_Exception()
        {
            Should.Throw<ArgumentException>(() =>
            {
                new List<ICulture> { new EnglishUnitedStates(), new EnglishUnitedStates() }.Default();
            });
        }

        [Fact]
        public void Default_Given_Cultures_With_One_Default_Returns_Default_Culture()
        {
            // Arrange
            var cultures = new List<ICulture>
            {
                new CultureStub(),
                new EnglishUnitedStates() // <----- default
            };

            // Act
            var result = cultures.Default();

            // Assert
            result.ShouldNotBeNull();
            result.IsDefault.ShouldBeTrue();
            result.ShouldBeOfType<EnglishUnitedStates>();
        }

        #endregion Default

        #region Exists

        [Fact]
        public void Exists_When_CultureCode_DoesNotExist_Returns_False()
        {
            new List<ICulture> { new CultureStub() }.Exists("404").ShouldBeFalse();
        }

        [Fact]
        public void Exists_When_CultureCode_Exists_Returns_True()
        {
            // Arrange
            var expected = new CultureStub();

            // Act & Assert
            new List<ICulture> { expected }.Exists(expected.Code).ShouldBeTrue();
        }

        #endregion Exists

        #region ToCultureCodes

        [Fact]
        public void ToCultureCodes_Without_Arguments_Returns_ListOf_CultureCodes()
        {
            // Arrange
            var expected = new CultureStub();
            var expected2 = new EnglishUnitedStates();
            var cultures = new List<ICulture> { expected, expected2 };

            // Act
            var result = cultures.ToCultureCodes();

            // Assert
            result.ShouldNotBeNull();
            result.ShouldContain(expected.Code);
            result.ShouldContain(expected2.Code);
        }

        [Fact]
        public void ToCultureCodes_Given_Delimiter_IsNull_Throws_Exception()
        {
            Should.Throw<Exception>(() =>
            {
                new List<ICulture> { new CultureStub() }.ToCultureCodes(null);
            });
        }

        [Theory]
        [InlineData("-")]
        [InlineData("- ")]
        [InlineData("--")]
        [InlineData("- -")]
        [InlineData(" -")]
        [InlineData(" - ")]
        public void ToCultureCodes_Given_Delimiter_IsHyphen_Throws_Exception(string hyphenatedDelimiter)
        {
            Should.Throw<Exception>(() =>
            {
                new List<ICulture> { new CultureStub() }.ToCultureCodes(hyphenatedDelimiter);
            });
        }

        [Fact]
        public void ToCultureCodes_Given_Delimiter_IsEmptyString_Throws_Exception()
        {
            Should.Throw<Exception>(() =>
            {
                new List<ICulture> { new CultureStub() }.ToCultureCodes("");
            });
        }

        [Theory]
        [InlineData(" ")]
        [InlineData("|")]
        [InlineData(".")]
        [InlineData("@")]
        public void ToCultureCodes_Given_Delimiter_IsValid_Returns_Custom_Delimited_Codes(string expectedDelimiter)
        {
            // Arrange
            var expectedCode = new CultureStub().Code;

            // Act
            var result = new List<ICulture> { new CultureStub(), new EnglishUnitedStates() }.ToCultureCodes(expectedDelimiter);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldContain(expectedCode);
            result.ShouldContain(expectedDelimiter);
        }

        #endregion ToCultureCodes

        #region ToCultureInfo

        [Fact]
        public void ToCultureInfo_Given_Null_Throws_Exception()
        {
            Should.Throw<Exception>(() =>
            {
                ICultureExtensions.ToCultureInfo(null);
            });
        }

        [Fact]
        public void ToCultureInfo_Returns_Mapped_CultureInfo()
        {
            // Arrange
            var expected = new CultureStub();

            // Act
            var result = expected.ToCultureInfo();

            // Assert
            result.ShouldNotBeNull();
            result.Name.ShouldBe(expected.Code);
        }

        #endregion ToCultureInfo

        #region ToCultureInfos

        [Fact]
        public void ToCultureInfos_Given_List_Containing_Null_Returns_Throws_Exception()
        {
            Should.Throw<Exception>(() =>
            {
                new List<ICulture> { new CultureStub(), null }.ToCultureInfos();
            });
        }

        [Fact]
        public void ToCultureInfos_Returns_ListOf_Mapped_CultureInfos()
        {
            // Arrange
            var expected = new CultureStub();
            var expected2 = new EnglishUnitedStates();
            var cultures = new List<ICulture> { expected, expected2 };

            // Act
            var results = cultures.ToCultureInfos();

            // Assert
            results.ShouldNotBeEmpty();
            results.ShouldContain(e => e.Name == expected.Code);
            results.ShouldContain(e => e.Name == expected2.Code);
        }

        #endregion ToCultureInfos
    }
}
