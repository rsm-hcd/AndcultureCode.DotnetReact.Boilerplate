using AndcultureCode.CSharp.Testing.Tests;
using AndcultureCode.GB.Business.Core.Utilities.Network;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Utilities.Network
{
    public class UriUtilTest : BaseUnitTest
    {
        #region Setup

        public UriUtilTest(ITestOutputHelper output) : base(output) { }

        #endregion Setup

        #region IsInValidHttpUrl

        [Fact]
        public void IsInValidHttpUrl_With_Invalid_Url_Returns_True()
        {
            UriUtil.IsInvalidHttpUrl("www.google.com").ShouldBeTrue();
        }

        [Fact]
        public void IsInValidHttpUrl_With_Valid_Url_Returns_False()
        {
            UriUtil.IsInvalidHttpUrl("http://www.google.com").ShouldBeFalse();
        }

        #endregion IsInValidHttpUrl

        #region IsValidHttpUrl

        [Fact]
        public void IsValidHttpUrl_With_Valid_Url_Returns_True()
        {
            UriUtil.IsValidHttpUrl("http://www.google.com").ShouldBeTrue();
        }

        [Fact]
        public void IsValidHttpUrl_With_Https_Url_Returns_True()
        {
            UriUtil.IsValidHttpUrl("https://www.google.com").ShouldBeTrue();
        }

        [Fact]
        public void IsValidHttpUrl_With_Null_Returns_False()
        {
            UriUtil.IsValidHttpUrl(null).ShouldBeFalse();
        }

        [Fact]
        public void IsValidHttpUrl_With_Empty_String_Returns_False()
        {
            UriUtil.IsValidHttpUrl(string.Empty).ShouldBeFalse();
        }

        [Fact]
        public void IsValidHttpUrl_With_Incomplete_Url_Returns_False()
        {
            UriUtil.IsValidHttpUrl("www.google.com").ShouldBeFalse();
        }

        #endregion IsValidHttpUrl


    }
}
