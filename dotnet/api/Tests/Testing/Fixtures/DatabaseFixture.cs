using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using AndcultureCode.CSharp.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using Testing.Extensions;
using Respawn;
using AndcultureCode.CSharp.Core.Utilities.Configuration;
using AndcultureCode.CSharp.Core.Constants;

namespace AndcultureCode.GB.Tests.Testing.Fixtures
{
    public abstract class DatabaseFixture : IDisposable
    {
        #region Properties

        private IConfigurationRoot _configuration { get; set; }
        public SqlConnectionStringBuilder Connection { get; set; }
        public IContext Context => new GBApiContext(Connection.ConnectionString, null);
        public bool DeleteDatabaseBetweenTests = false;

        #endregion Properties

        #region Setup

        protected DatabaseFixture(string collectionName)
        {
            // Note: If 'Connection' is resulting in 'null', you need to make sure the correct appSettings.json
            // is getting copied into your test project output. Verify you have the file being copied in your test
            // project's .csproj file correctly.
            Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", EnvironmentConstants.TESTING); // For use in EF Core migration
            _configuration = ConfigurationUtils.GetConfiguration();
            Connection = _configuration.GetTestDatabaseConnectionStringBuilder(collectionName);
            Console.WriteLine($"[DatabaseFixture] Test database name: {Connection.InitialCatalog}");
            Context.CreateStructure();

        }

        #endregion Setup

        #region Teardown

        public void Dispose() => Context.DeleteDatabase();

        #endregion Teardown

        #region Public Methods

        /// <summary>
        /// Retrieves and cleans data from all application database tables for the configured database.
        /// </summary>
        public void CleanDatabaseTables()
        {
            using (var sqlConnection = new SqlConnection(Connection.ToString()))
            {
                sqlConnection.Open();

                var checkpoint = new Checkpoint
                {
                    TablesToIgnore = new string[]
                    {
                        "__EFMigrationsHistory"
                    },
                };

                checkpoint.Reset(sqlConnection).GetAwaiter().GetResult();
            }
        }

        /// <summary>
        /// Retrieves a new Context object, connecting to the test database.
        /// </summary>
        /// <returns></returns>
        public Context GetNewContext()
        {
            return new GBApiContext(Connection.ConnectionString, null);
        }

        #endregion Public Methods
    }
}
