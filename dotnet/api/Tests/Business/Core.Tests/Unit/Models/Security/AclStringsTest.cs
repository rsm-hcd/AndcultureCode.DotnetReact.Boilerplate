using System;
using AndcultureCode.GB.Business.Core.Models.Security;
using AndcultureCode.GB.Testing.Tests;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Models.Security
{
    public class AclStringsTest : ApiUnitTest, IDisposable
    {
        #region Setup

        public AclStringsTest(ITestOutputHelper output) : base(output)
        {
        }

        #endregion Setup

        #region GetAclStrings

        [Fact]
        public void GetAclStrings_Returns_Constants()
        {
            // Arrange
            var expected = AclStrings.TESTRESOURCE_READ;

            // Act
            var result = AclStrings.GetAclStrings();

            // Assert
            result.ShouldNotBeNull();
            result.Count.ShouldBeGreaterThan(0);
            result.ShouldContain(expected);
        }

        #endregion GetAclStrings

        #region GetAclStringPairs

        [Fact]
        public void GetAclStringPairs_Returns_Constants()
        {
            // Arrange
            var expected = AclStrings.TESTRESOURCE_READ;

            // Act
            var result = AclStrings.GetAclStringPairs();

            // Assert
            result.ShouldNotBeNull();
            result.Count.ShouldBeGreaterThan(0);
            result.ShouldContain(e => e.Key == "TESTRESOURCE_READ");
            result.ShouldContain(e => e.Value == expected);
        }

        #endregion GetAclStringPairs

        #region GetAclStringsByPrefix

        [Fact]
        public void GetAclStringsByPrefix_When_PrefixOf_Null_Returns_EmptyList()
        {
            // Arrange & Act
            var result = AclStrings.GetAclStringsByPrefix(null);

            // Assert
            result.ShouldNotBeNull();
            result.ShouldBeEmpty();
        }

        [Fact]
        public void GetAclStringsByPrefix_When_PrefixOf_EmptyString_Returns_EmptyList()
        {
            // Arrange & Act
            var result = AclStrings.GetAclStringsByPrefix(" ");

            // Assert
            result.ShouldNotBeNull();
            result.ShouldBeEmpty();
        }

        [Fact]
        public void GetAclStringsByPrefix_When_Prefix_DoesNotMatch_Returns_EmptyList()
        {
            // Arrange & Act
            var result = AclStrings.GetAclStringsByPrefix("prefix-that-does-not-match");

            // Assert
            result.ShouldNotBeNull();
            result.ShouldBeEmpty();
        }

        [Fact]
        public void GetAclStringsByPrefix_When_Prefix_CaseInsensitively_Matches_Returns_Results()
        {
            // Arrange & Act
            var result = AclStrings.GetAclStringsByPrefix("tEstresOurce");

            // Assert
            result.ShouldNotBeNull();
            result.ShouldNotBeEmpty();
        }

        #endregion GetAclStringsByPrefix

    }
}