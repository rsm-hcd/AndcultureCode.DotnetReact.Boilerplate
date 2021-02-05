using System;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit;

namespace Data.SqlServer.Tests.Integration
{
    /// <summary>
    /// Purely so XUnit can dependency inject me for testing this assembly
    /// </summary>
    public class RepositoryTestFixture : DatabaseFixture, IDisposable
    {

        public RepositoryTestFixture() : base(nameof(RepositoryTestFixture))
        {
        }
    }

    [CollectionDefinition("Repository")]
    public class RepositoryTestCollection : ICollectionFixture<RepositoryTestFixture> { }
}
