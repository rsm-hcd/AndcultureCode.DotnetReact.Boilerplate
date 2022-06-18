using System;
using AndcultureCode.GB.Tests.Testing.Constants;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit;

namespace AndcultureCode.GB.Tests.Presentation.Web.Tests.Integration.Controllers
{
    public class ControllerFixture : DatabaseFixture, IDisposable
    {
        public ControllerFixture() : base(nameof(ControllerFixture), FixturePorts.CONTROLLER_FIXTURE_PORT)
        {
        }
    }

    [CollectionDefinition("ControllerIntegration")]
    public class ControllerTestCollection : ICollectionFixture<ControllerFixture> { }
}