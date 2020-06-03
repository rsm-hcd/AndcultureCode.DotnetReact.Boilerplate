using AndcultureCode.GB.Business.Core.Extensions;
using Shouldly;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.CSharp.Testing.Extensions;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Net;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Extensions
{
    public class HttpRequestExtensionsTest : ApiUnitTest
    {
        #region Setup

        public HttpRequestExtensionsTest(ITestOutputHelper output) : base(output)
        {

        }

        #endregion Setup

        #region GetForwardedIpAddress

        [Fact]
        public void GetForwardedIpAddress_When_HttpRequest_Null_Returns_Null()
        {
            // Arrange
            HttpRequest sut = null;

            // Act
            var result = sut.GetForwardedIpAddress();

            // Assert
            result.ShouldBeNull();
        }

        [Fact]
        public void GetForwardedIpAddress_When_Headers_Null_Returns_Null()
        {
            // Arrange
            var mockSut = new Mock<HttpRequest>();
            mockSut.Setup((e) => e.Headers).Returns(value: null);
            var sut = mockSut.Object;

            // Act
            var result = sut.GetForwardedIpAddress();

            // Assert
            result.ShouldBeNull();
        }

        [Fact]
        public void GetForwardedIpAddress_When_Headers_Does_Not_Contain_XForwardedFor_Key_Returns_Null()
        {
            // Arrange
            var mockSut = new Mock<HttpRequest>();
            mockSut.Setup((e) => e.Headers).Returns(value: new HeaderDictionary());
            var sut = mockSut.Object;

            // Act
            var result = sut.GetForwardedIpAddress();

            // Assert
            result.ShouldBeNull();
        }

        [Fact]
        public void GetForwardedIpAddress_When_Headers_Contains_XForwardedFor_Key_With_Empty_Value_Returns_Null()
        {
            // Arrange
            var headerDictionary = new HeaderDictionary();
            headerDictionary.Add(HttpRequestExtensions.X_FORWARDED_FOR, string.Empty);
            var mockSut = new Mock<HttpRequest>();
            mockSut.Setup((e) => e.Headers).Returns(value: headerDictionary);
            var sut = mockSut.Object;

            // Act
            var result = sut.GetForwardedIpAddress();

            // Assert
            result.ShouldBeNull();
        }

        [Fact]
        public void GetForwardedIpAddress_When_Headers_Contains_XForwardedFor_Key_With_Whitespace_Value_Returns_Null()
        {
            // Arrange
            var headerDictionary = new HeaderDictionary();
            headerDictionary.Add(HttpRequestExtensions.X_FORWARDED_FOR, "  ");
            var mockSut = new Mock<HttpRequest>();
            mockSut.Setup((e) => e.Headers).Returns(value: headerDictionary);
            var sut = mockSut.Object;

            // Act
            var result = sut.GetForwardedIpAddress();

            // Assert
            result.ShouldBeNull();
        }

        [Fact]
        public void GetForwardedIpAddress_When_Headers_Contains_XForwardedFor_Key_With_Value_Returns_Value()
        {
            // Arrange
            var mockIpAddress = new IPAddress(Random.Bytes(4));
            var headerDictionary = new HeaderDictionary();
            headerDictionary.Add(HttpRequestExtensions.X_FORWARDED_FOR, mockIpAddress.ToString());
            var mockSut = new Mock<HttpRequest>();
            mockSut.Setup((e) => e.Headers).Returns(value: headerDictionary);
            var sut = mockSut.Object;

            // Act
            var result = sut.GetForwardedIpAddress();

            // Assert
            result.ShouldBe(mockIpAddress.ToString());
        }

        #endregion GetForwardedIpAddress
    }
}