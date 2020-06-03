using System;
using System.Collections.Generic;
using System.Linq;
using AndcultureCode.CSharp.Core.Interfaces.Entity;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Testing.Tests;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit.Abstractions;

namespace Data.SqlServer.Tests.Integration
{
    public class RepositoryIntegrationTest : ApiIntegrationTest, IDisposable
    {
        #region Member Variables

        protected GBApiContext GBApiContext => (GBApiContext)Context;
        protected DatabaseFixture Fixture;

        #endregion Member Variables


        #region Constructor

        public RepositoryIntegrationTest(
            DatabaseFixture fixture,
            ITestOutputHelper output
        ) : base(output, fixture.Context)
        {
            fixture.CleanDatabaseTables();

            Fixture = fixture;
        }

        #endregion Constructor


        #region Teardown

        public override void Dispose()
        {
            base.Dispose();
        }

        #endregion Teardown


        #region Protected Methods

        protected void Reload(IEntity entity) => GBApiContext.Entry(entity).Reload();
        protected void Reload(IEnumerable<IEntity> entities) => entities.ToList().ForEach((e) => GBApiContext.Entry(e).Reload());

        #endregion Protected Methods
    }
}
