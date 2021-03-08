using System;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit;

namespace AndcultureCode.GB.Business.Conductors.Tests.Integration
{
    /// <summary>
    /// Purely so XUnit can dependency inject me for testing this assembly
    /// </summary>
    public class ConductorFixture : DatabaseFixture, IDisposable
    {
        public ConductorFixture() : base(nameof(ConductorFixture))
        {
        }
    }

    [CollectionDefinition("ConductorIntegration")]
    public class ConductorTestCollection : ICollectionFixture<ConductorFixture> { }
}
