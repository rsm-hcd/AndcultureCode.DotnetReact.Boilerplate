using System.Collections.Generic;
using AndcultureCode.CSharp.Extensions;
using AndcultureCode.CSharp.Testing.Tests;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Extensions
{
    public class EnumerableExtensionsTest : BaseUnitTest
    {
        #region Setup

        public EnumerableExtensionsTest(ITestOutputHelper output) : base(output)
        {
        }

        #endregion

        #region IsEmpty (No Arguments)

        // TODO: Remove and ensure testing coverage is in AndcultureCode.CSharp.Testing

        [Fact]
        public void IsEmpty_Given_No_Arguments_When_Empty_Returns_True()
        {
            // Arrange
            new List<string>() { "something" }
            // Act
                .IsEmpty()
            // Assert
                .ShouldBeFalse();
        }


        #endregion
    }
}