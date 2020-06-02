using System;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit;

namespace AndcultureCode.GB.Tests.Business.Core.Tests.Integration
{
    /// <summary>
    /// Purely so XUnit can dependency inject me for testing this assembly
    /// </summary>
    public class CoreIntegrationTestFixture : DatabaseFixture, IDisposable { }

    [CollectionDefinition("CoreIntegration")]
    public class CoreIntegrationTestCollection : ICollectionFixture<CoreIntegrationTestFixture> { }
}