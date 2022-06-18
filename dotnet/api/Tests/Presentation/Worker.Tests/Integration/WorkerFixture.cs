using System;
using AndcultureCode.GB.Tests.Testing.Constants;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit;

namespace AndcultureCode.GB.Presentation.Worker.Tests.Integration
{
    /// <summary>
    /// Purely so XUnit can dependency inject me for testing this assembly
    /// </summary>
    public class WorkerFixture : DatabaseFixture, IDisposable
    {
        public WorkerFixture() : base(nameof(WorkerFixture), FixturePorts.WORKER_FIXTURE_PORT)
        {
        }
    }

    [CollectionDefinition("WorkerIntegration")]
    public class WorkerTestCollection : ICollectionFixture<WorkerFixture> { }
}
