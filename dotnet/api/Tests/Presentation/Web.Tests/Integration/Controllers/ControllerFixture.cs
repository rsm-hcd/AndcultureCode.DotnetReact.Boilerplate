using System;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit;

namespace AndcultureCode.GB.Tests.Presentation.Web.Tests.Integration.Controllers
{
    public class ControllerFixture : DatabaseFixture, IDisposable { }

    [CollectionDefinition("ControllerIntegration")]
    public class ControllerTestCollection : ICollectionFixture<ControllerFixture> { }
}