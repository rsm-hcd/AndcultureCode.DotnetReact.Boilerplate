using AndcultureCode.GB.Business.Core.Extensions;
using Shouldly;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;
using System.Collections.Generic;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Extensions
{
    public class DictionaryExtensionsTest : CodesApiUnitTest
    {
        #region Constants

        public const string KEY1 = "Key1";
        public const string KEY2 = "Key2";
        public const string VALUE1 = "Value1";
        public const string VALUE2 = "Value2";

        #endregion Constants

        #region Setup

        public DictionaryExtensionsTest(ITestOutputHelper output) : base(output)
        {

        }

        #endregion Setup

        #region Merge

        [Fact]
        public void Merge_Returns_Dictionary_With_KeyValuePairs_From_Both_Dictionaries()
        {
            // Arrange
            var left = new Dictionary<string, string>();
            left.Add(KEY1, VALUE1);

            var right = new Dictionary<string, string>();
            right.Add(KEY2, VALUE2);

            // Act
            var result = left.Merge(right);

            // Assert
            result.ShouldContainKeyAndValue(KEY1, VALUE1);
            result.ShouldContainKeyAndValue(KEY2, VALUE2);
        }

        [Fact]
        public void Merge_When_Left_Is_Null_And_Right_Is_Empty_Returns_Null()
        {
            // Arrange
            Dictionary<string, string> left = null;
            var right = new Dictionary<string, string>();

            // Act
            var result = left.Merge(right);

            // Assert
            result.ShouldBeNull();
        }

        [Fact]
        public void Merge_When_Left_Is_Null_And_Right_Has_Values_Returns_Null()
        {
            // Arrange
            Dictionary<string, string> left = null;

            var right = new Dictionary<string, string>();
            right.Add(KEY1, VALUE1);

            // Act
            var result = left.Merge(right);

            // Assert
            result.ShouldBeNull();
        }

        [Fact]
        public void Merge_When_Right_Is_Null_Returns_Left()
        {
            // Arrange
            var left = new Dictionary<string, string>();
            Dictionary<string, string> right = null;

            // Act
            var result = left.Merge(right);

            // Assert
            result.ShouldBe(left);
        }

        [Fact]
        public void Merge_When_Duplicate_Key_Found_Returns_Dictionary_Without_Duplicate()
        {
            // Arrange
            var left = new Dictionary<string, string>();
            left.Add(KEY1, VALUE1);

            var right = new Dictionary<string, string>();
            right.Add(KEY1, VALUE1);

            var expectedDictionary = new Dictionary<string, string>();
            expectedDictionary.Add(KEY1, VALUE1);

            // Act
            var result = left.Merge(right);

            // Assert
            result.ShouldBe(expectedDictionary);
        }

        [Fact]
        public void Merge_When_Duplicate_Key_Found_And_TakeLastKey_False_Returns_Dictionary_With_First_Key_Instance()
        {
            // Arrange
            var left = new Dictionary<string, string>();
            left.Add(KEY1, VALUE1);

            var right = new Dictionary<string, string>();
            // This is the important setup. This key/value pair should be ignored since left already has the same key and 'takeLastKey' is false.
            right.Add(KEY1, VALUE2);

            var expectedDictionary = new Dictionary<string, string>();
            expectedDictionary.Add(KEY1, VALUE1);

            // Act
            var result = left.Merge(
                right: right,
                takeLastKey: false
            );

            // Assert
            result.ShouldBe(expectedDictionary);
        }

        [Fact]
        public void Merge_When_Duplicate_Key_Found_And_TakeLastKey_True_Returns_Dictionary_With_First_Key_Instance()
        {
            // Arrange
            var left = new Dictionary<string, string>();
            left.Add(KEY1, VALUE1);

            var right = new Dictionary<string, string>();
            // This is the important setup. This key/value pair SHOULD be used since 'takeLastKey' is true and the left already has the same key.
            right.Add(KEY1, VALUE2);

            var expectedDictionary = new Dictionary<string, string>();
            expectedDictionary.Add(KEY1, VALUE2);

            // Act
            var result = left.Merge(
                right: right,
                takeLastKey: true
            );

            // Assert
            result.ShouldBe(expectedDictionary);
        }

        #endregion Merge
    }
}