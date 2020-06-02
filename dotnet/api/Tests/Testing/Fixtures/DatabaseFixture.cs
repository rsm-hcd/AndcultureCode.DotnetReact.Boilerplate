using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using AndcultureCode.CSharp.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using Testing.Extensions;
using Config = AndcultureCode.GB.Business.Core.Utilities.Configuration.Configuration;
namespace AndcultureCode.GB.Tests.Testing.Fixtures
{
    public abstract class DatabaseFixture : IDisposable
    {
        #region Properties

        private IConfigurationRoot _configuration { get; set; }
        public GBApiConnection Connection { get; set; }
        public IContext Context => new GBApiContext(Connection, null);
        public bool DeleteDatabaseBetweenTests = false;

        #endregion Properties

        #region Setup

        protected DatabaseFixture()
        {
            _configuration = Config.GetConfiguration();

            // Note: If 'Connection' is resulting in 'null', you need to make sure the correct appSettings.json
            // is getting copied into your test project output. Verify you have the file being copied in your test
            // project's .csproj file correctly.
            Connection = _configuration.GetTestDatabaseGBApiConnection();

            Console.WriteLine($"[DatabaseFixture] Test database name: {Connection.Database}");
            Console.WriteLine($"[DatabaseFixture] -- Shared mode (higher performance): Leave 'TEST_DATABASE_NAME' environment variable unset or assign your own value.");
            Console.WriteLine($"[DatabaseFixture] -- Generation mode (flexible and less error prone): Set 'TEST_DATABASE_NAME' environment variable to 'generate' to have unique database created for each test run.");

            // Only create the database from scratch if it is a dynamically generated database
            if (_configuration.IsTestDatabaseNameDynamic())
            {
                Context.CreateStructure();
            }
        }

        #endregion


        #region Teardown

        public void Dispose()
        {
            if (_configuration.IsTestDatabaseNameDynamic())
            {
                Context.DeleteDatabase();
            }
        }

        #endregion


        #region Public Methods

        /// <summary>
        /// Retrieves and cleans data from all application database tables for the configured database.
        /// </summary>
        public void CleanDatabaseTables()
        {
            using (var sqlConnection = new SqlConnection(Connection.ToString()))
            {
                sqlConnection.Open();

                var tableNames = GetTableNames(sqlConnection);

                CleanDatabaseTables(sqlConnection, tableNames);
            }
        }

        /// <summary>
        /// Attempt to delete each table. If it fails due to key constraints we keep going and loop around later when the dependent table has been deleted.
        /// </summary>
        /// <param name="sqlConnection"></param>
        /// <param name="tableNames"></param>
        public void CleanDatabaseTables(SqlConnection sqlConnection, List<string> tableNames)
        {
            // clean up any problematic referential field values

            for (var i = 0; tableNames.Count > 0; i++)
            {
                try
                {
                    using (var command = new SqlCommand($"DELETE FROM [{tableNames.ElementAt(i % tableNames.Count)}]", sqlConnection))
                    {
                        command.ExecuteNonQuery();
                        tableNames.RemoveAt(i % tableNames.Count);
                        i = -1; // flag: a table was removed. in the next iteration i++ will be the 0 index.
                    }
                }
                catch (SqlException e) // ignore errors as these are expected due to linked foreign key data
                {
                    if (i % tableNames.Count == tableNames.Count - 1)
                    {
                        // end of tables-list without any success to delete any table, then exit with exception:
                        throw new Exception("Unable to clear all relevant tables in database (foriegn key constraint ?). See inner-exception for more details.", e);
                    }
                }
            }
        }

        /// <summary>
        /// Retrieves a new Context object, connecting to the test database.
        /// </summary>
        /// <returns></returns>
        public Context GetNewContext()
        {
            return new GBApiContext(Connection, null);
        }

        /// <summary>
        /// Retrieves all application specific database table names for the provided sql server connection
        /// </summary>
        /// <param name="sqlConnection"></param>
        /// <returns></returns>
        public List<string> GetTableNames(SqlConnection sqlConnection)
        {
            var results = new List<string>();

            using (var command = new SqlCommand("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME NOT LIKE '%Migration%' AND TABLE_NAME NOT LIKE 'AspNet%'", sqlConnection))
            {
                var commandReader = command.ExecuteReader();

                while (commandReader.Read())
                {
                    results.Add(commandReader.GetString(0));
                }
            }

            return results;
        }

        #endregion

        #region Private Methods

        #endregion Private Methods
    }
}
