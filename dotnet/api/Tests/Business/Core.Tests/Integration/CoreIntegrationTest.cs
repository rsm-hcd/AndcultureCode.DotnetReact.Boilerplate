using System;
using System.Collections.Generic;
using System.Linq;
using AndcultureCode.CSharp.Core.Interfaces.Entity;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Testing.Tests;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Tests.Business.Core.Tests.Integration
{
    public class CoreIntegrationTest : ApiIntegrationTest, IDisposable
    {

        #region Member Variables

        protected GBApiContext GBApiContext => (GBApiContext)Context;

        #endregion

        #region Constructor

        public CoreIntegrationTest(
            DatabaseFixture fixture,
            ITestOutputHelper output
        ) : base(output, fixture.Context)
        {
            fixture.CleanDatabaseTables();
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