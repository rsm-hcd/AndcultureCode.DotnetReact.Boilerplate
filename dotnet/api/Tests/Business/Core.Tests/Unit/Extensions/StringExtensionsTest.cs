using AndcultureCode.GB.Business.Core.Extensions;
using Shouldly;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;
using System;
using System.Linq;
using AndcultureCode.CSharp.Testing.Extensions;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Extensions
{
    public class StringExtensionsTest : ApiUnitTest
    {
        #region Constants

        private const string TEST_FILE_PREFIX = "prefix";

        #endregion Constants

        #region Setup

        public StringExtensionsTest(ITestOutputHelper output) : base(output)
        {

        }

        #endregion Setup

        #region Convert

        [Fact]
        public void Convert_When_Int_Type_Conversion_Succeeds_Returns_Int()
        {
            // Arrange
            var integerString = "100";

            // Act
            var result = integerString.Convert<int>();

            // Assert
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBe(100);
        }

        [Fact]
        public void Convert_When_DateTime_Type_Conversion_Succeeds_Returns_DateTime()
        {
            // Arrange
            var dateString = "2020-01-17";

            // Act
            var result = dateString.Convert<DateTime>();

            // Assert
            result.ShouldNotHaveErrors();
            result.ResultObject.ShouldBe(new DateTime(year: 2020, month: 01, day: 17));
        }

        [Fact]
        public void Convert_When_DateTime_Type_Conversion_Fails_Returns_Error()
        {
            // Arrange
            var badDateString = "ABC";

            // Act
            var result = badDateString.Convert<DateTime>();

            // Assert
            result.ShouldHaveErrorsFor(StringExtensions.ERROR_CONVERTING_TO_TYPE);
        }

        [Fact]
        public void Convert_When_Int_Type_Conversion_Fails_Returns_Error()
        {
            // Arrange
            var maxLongString = long.MaxValue.ToString();

            // Act
            var result = maxLongString.Convert<int>();

            // Assert
            result.ShouldHaveErrorsFor(StringExtensions.ERROR_CONVERTING_TO_TYPE);
        }

        #endregion Convert
    }
}
