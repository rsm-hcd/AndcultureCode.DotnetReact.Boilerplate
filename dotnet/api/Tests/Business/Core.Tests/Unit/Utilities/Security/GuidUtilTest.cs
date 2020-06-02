using System;
using AndcultureCode.CSharp.Testing.Tests;
using AndcultureCode.GB.Business.Core.Utilities.Security;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Utilities.Security
{
    public class GuidUtilTest : BaseUnitTest
    {
        #region Setup

        public GuidUtilTest(ITestOutputHelper output) : base(output) { }

        #endregion Setup

        #region IsInvalid

        [Fact]
        public void IsInvalid_With_Valid_Guid_Returns_False()
        {
            GuidUtil.IsInvalid(Guid.NewGuid().ToString()).ShouldBeFalse();
        }

        [Fact]
        public void IsInvalid_With_Invalid_Guide_Returns_True()
        {
            GuidUtil.IsInvalid("not a guid").ShouldBeTrue();
        }

        #endregion IsInvalid

        #region IsValid

        [Fact]
        public void IsValid_With_Valid_Guid_Returns_True()
        {
            GuidUtil.IsValid(Guid.NewGuid().ToString()).ShouldBeTrue();
        }

        [Fact]
        public void IsValid_With_Invaid_Guid_Returns_False()
        {
            GuidUtil.IsValid("not a guid").ShouldBeFalse();
        }

        [Fact]
        public void IsValid_With_Null_Guid_Returns_False()
        {
            GuidUtil.IsValid(null).ShouldBeFalse();
        }

        [Fact]
        public void IsValid_With_Empty_String_Guid_Returns_False()
        {
            GuidUtil.IsValid(string.Empty).ShouldBeFalse();
        }

        #endregion IsValid
    }
}
