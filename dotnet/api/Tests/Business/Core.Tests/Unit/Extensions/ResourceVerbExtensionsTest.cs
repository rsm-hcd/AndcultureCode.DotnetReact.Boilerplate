using System;
using AndcultureCode.GB.Testing.Tests;
using Shouldly;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.GB.Business.Core.Extensions;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Extensions
{
    public class ResourceVerbExtensionsTest : CodesApiUnitTest
    {

        #region Properties

        const string TEST_RESOURCE_READ = "TestResource_Read";
        const string TEST_RESOURCE_WRITE = "TestResource_Write";
        const string TEST_RESOURCE_NESTED_READ = "TestResource_Nested_Read";
        const string TEST_RESOURCE_BAD = "TestResource";
        const string TEST_RESOURCE = "TestResource";
        const string TEST_RESOURCE_NESTED = "TestResource_Nested";
        const string READ_VERB = "Read";
        const string WRITE_VERB = "Write";

        #endregion Properties

        #region Setup

        public ResourceVerbExtensionsTest(ITestOutputHelper output) : base(output)
        {
        }

        #endregion Setup

        #region ToResourceVerb

        [Fact]
        public void ToResourceVerb_Returns_Resource_And_Verb()
        {
            // Arrange & Act
            var result = TEST_RESOURCE_READ.ToResourceVerb();

            // Assert
            result.ShouldNotBeNull();
            result.Resource.ShouldBe(TEST_RESOURCE);
            result.Verb.ShouldBe(READ_VERB);
        }

        [Fact]
        public void ToResourceVerb_Returns_Resource_And_Verb_When_Multiple_Underscores()
        {
            // Arrange & Act
            var result = TEST_RESOURCE_NESTED_READ.ToResourceVerb();

            // Assert
            result.ShouldNotBeNull();
            result.Resource.ShouldBe(TEST_RESOURCE_NESTED);
            result.Verb.ShouldBe(READ_VERB);
        }

        [Fact]
        public void ToResourceVerb_Throws_ArgumentOutOfRangeException_When_No_Underscore()
        {
            // Arrange & Act
            var exception = Record.Exception(() => TEST_RESOURCE_BAD.ToResourceVerb());

            // Assert
            exception.ShouldNotBeNull();
            exception.ShouldBeOfType<ArgumentException>();
        }

        #endregion

        #region ToResourceVerbs

        [Fact]
        public void ToResourceVerbs_Returns_List_Of_Resources_And_Verbs()
        {
            // Arrange
            var list = new string[] { TEST_RESOURCE_READ, TEST_RESOURCE_WRITE };

            // Act
            var result = list.ToResourceVerbs();

            // Assert
            result.ShouldNotBeNull();
            result.Count.ShouldBe(2);
            result[0].Resource.ShouldBe(TEST_RESOURCE);
            result[0].Verb.ShouldBe(READ_VERB);
            result[1].Resource.ShouldBe(TEST_RESOURCE);
            result[1].Verb.ShouldBe(WRITE_VERB);
        }

        [Fact]
        public void ToResourceVerbs_Returns_Resource_And_Verb_When_Multiple_Underscores()
        {
            // Arrange
            var list = new string[] { TEST_RESOURCE_READ, TEST_RESOURCE_NESTED_READ };

            // Act
            var result = list.ToResourceVerbs();

            // Assert
            result.ShouldNotBeNull();
            result.Count.ShouldBe(2);
            result[0].Resource.ShouldBe(TEST_RESOURCE);
            result[0].Verb.ShouldBe(READ_VERB);
            result[1].Resource.ShouldBe(TEST_RESOURCE_NESTED);
            result[1].Verb.ShouldBe(READ_VERB);
        }

        [Fact]
        public void ToResourceVerbs_Throws_ArgumentException_When_No_Underscore()
        {
            // Arrange
            var list = new string[] { TEST_RESOURCE_READ, TEST_RESOURCE_BAD };

            // Arrange & Act
            var exception = Record.Exception(() => list.ToResourceVerbs());

            // Assert
            exception.ShouldNotBeNull();
            exception.ShouldBeOfType<ArgumentException>();
        }

        #endregion ToResourceVerbs
    }
}
