using Microsoft.Extensions.Configuration;
using Moq;
using AndcultureCode.GB.Business.Core.Extensions;
using Shouldly;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Extensions
{
    public class IConfigurationRootExtensionsTest : ApiUnitTest
    {
        #region Setup

        public IConfigurationRootExtensionsTest(ITestOutputHelper output) : base(output) { }

        #endregion Setup


        #region GetDatabaseConnectionString

        [Fact]
        public void GetDatabaseConnectionString_When_Configuration_Null_Returns_Null()
        {
            IConfigurationRootExtensions.GetDatabaseConnectionString(null).ShouldBeNull();
        }

        [Fact]
        public void GetDatabaseConnectionString_When_ConnectionStrings_Section_NotFound_Returns_Null()
        {
            // Arrange
            var configurationMock = new Mock<IConfigurationRoot>();

            // Act & Assert
            IConfigurationRootExtensions.GetDatabaseConnectionString(configurationMock.Object).ShouldBeNull();
        }

        [Fact]
        public void GetDatabaseConnectionString_When_ConnectionStrings_Section_Missing_PrimaryDatabase_Returns_Null()
        {
            // Arrange
            var configurationMock = new Mock<IConfigurationRoot>();
            configurationMock
                .SetupGet(e => e["ConnectionStrings:Other"]).Returns("unexpected");

            // Act & Assert
            IConfigurationRootExtensions.GetDatabaseConnectionString(configurationMock.Object).ShouldBeNull();
        }

        [Fact]
        public void GetDatabaseConnectionString_When_ConnectionStrings_Section_Contains_PrimaryDatabase_Returns_Value()
        {
            // Arrange
            var expected = Random.String();

            var codesApiConfigurationSectionMock = new Mock<IConfigurationSection>();
            codesApiConfigurationSectionMock
                .SetupGet(e => e.Value)
                .Returns(expected);

            var connectionsConfigurationSectionMock = new Mock<IConfigurationSection>();
            connectionsConfigurationSectionMock
                .Setup(e => e.GetSection(ApplicationConstants.DATABASE_CONFIGURATION_KEY))
                .Returns(codesApiConfigurationSectionMock.Object);

            var configurationMock = new Mock<IConfigurationRoot>();
            configurationMock
                .Setup(e => e.GetSection("ConnectionStrings"))
                .Returns(connectionsConfigurationSectionMock.Object);

            // Act
            var result = IConfigurationRootExtensions.GetDatabaseConnectionString(configurationMock.Object);

            // Assert
            result.ShouldBe(expected);
        }

        #endregion GetDatabaseConnectionString



        #region GetDatabaseName

        [Fact]
        public void GetDatabaseName_When_Configuration_Null_Returns_Null()
        {
            IConfigurationRootExtensions.GetDatabaseName(null).ShouldBeNull();
        }

        [Fact]
        public void GetDatabaseName_When_ConnectionStrings_Section_NotFound_Returns_Null()
        {
            // Arrange
            var configurationMock = new Mock<IConfigurationRoot>();

            // Act & Assert
            IConfigurationRootExtensions.GetDatabaseName(configurationMock.Object).ShouldBeNull();
        }

        [Fact]
        public void GetDatabaseName_When_ConnectionStrings_Section_Missing_PrimaryDatabase_Returns_Null()
        {
            // Arrange
            var configurationMock = new Mock<IConfigurationRoot>();
            configurationMock
                .SetupGet(e => e["ConnectionStrings:Other"]).Returns("unexpected");

            // Act & Assert
            IConfigurationRootExtensions.GetDatabaseName(configurationMock.Object).ShouldBeNull();
        }

        [Fact]
        public void GetDatabaseName_When_ConnectionStrings_Section_Contains_PrimaryDatabase_Missing_Database_Property_Returns_Null()
        {
            // Arrange
            var valueWithoutProperty = "Prop1=Value1;Proper2=Value2";

            var codesApiConfigurationSectionMock = new Mock<IConfigurationSection>();
            codesApiConfigurationSectionMock
                .SetupGet(e => e.Value)
                .Returns(valueWithoutProperty);

            var connectionsConfigurationSectionMock = new Mock<IConfigurationSection>();
            connectionsConfigurationSectionMock
                .Setup(e => e.GetSection(ApplicationConstants.DATABASE_CONFIGURATION_KEY))
                .Returns(codesApiConfigurationSectionMock.Object);

            var configurationMock = new Mock<IConfigurationRoot>();
            configurationMock
                .Setup(e => e.GetSection("ConnectionStrings"))
                .Returns(connectionsConfigurationSectionMock.Object);

            // Act
            var result = IConfigurationRootExtensions.GetDatabaseName(configurationMock.Object);

            // Assert
            result.ShouldBeNull();
        }

        [Theory]
        [InlineData("database")]
        [InlineData("Database")]
        [InlineData("DataBAse")]
        [InlineData(" DataBAse")]
        public void GetDatabaseName_When_ConnectionStrings_Section_Contains_PrimaryDatabase_Contains_Database_Property_Returns_Value(string databaseKey)
        {
            // Arrange
            var expected = "databaseValue";
            var valueWithoutProperty = $"Prop1=Value1;{databaseKey}={expected}";

            var codesApiConfigurationSectionMock = new Mock<IConfigurationSection>();
            codesApiConfigurationSectionMock
                .SetupGet(e => e.Value)
                .Returns(valueWithoutProperty);

            var connectionsConfigurationSectionMock = new Mock<IConfigurationSection>();
            connectionsConfigurationSectionMock
                .Setup(e => e.GetSection(ApplicationConstants.DATABASE_CONFIGURATION_KEY))
                .Returns(codesApiConfigurationSectionMock.Object);

            var configurationMock = new Mock<IConfigurationRoot>();
            configurationMock
                .Setup(e => e.GetSection("ConnectionStrings"))
                .Returns(connectionsConfigurationSectionMock.Object);

            // Act
            var result = IConfigurationRootExtensions.GetDatabaseName(configurationMock.Object);

            // Assert
            result.ShouldBe(expected);
        }

        #endregion GetDatabaseName
    }
}