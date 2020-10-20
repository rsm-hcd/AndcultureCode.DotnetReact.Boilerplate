using AndcultureCode.CSharp.Core.Constants;
using Microsoft.Extensions.Configuration;
using System;
using System.Data.SqlClient;

namespace Testing.Extensions
{
    public static class IConfigurationRootExtensions
    {
        /// <summary>
        /// Retrieves the connection string from appsettings
        /// and returns a new SqlConnectionStringBuilder from
        /// that connection string.
        /// </summary>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public static SqlConnectionStringBuilder GetDatabaseConnectionStringBuilder(this IConfigurationRoot configuration)
        {
            var connectionString = configuration
                .GetSection("ConnectionStrings")
                .GetValue<string>(ApplicationConstants.API_DATABASE_CONFIGURATION_KEY);

            return new SqlConnectionStringBuilder(connectionString);
        }

        /// <summary>
        /// Retrieves an SqlConnectionStringBuilder configured to work with the test database.
        /// </summary>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public static SqlConnectionStringBuilder GetTestDatabaseConnectionStringBuilder(this IConfigurationRoot configuration)
        {
            var connectionStringBuilder = configuration.GetDatabaseConnectionStringBuilder();
            connectionStringBuilder.InitialCatalog = configuration.GetTestDatabaseName();
            return connectionStringBuilder;
        }

        public static string GetTestDatabaseName(this IConfigurationRoot configuration)
        {
            var connectionStringBuilder = configuration.GetDatabaseConnectionStringBuilder();
            var databaseName = Environment.GetEnvironmentVariable("TEST_DATABASE_NAME");

            // When a test database name isn't specified, we default it for the runner
            if (string.IsNullOrWhiteSpace(databaseName))
            {
                return "GravityBootsApi-Test";
            }

            // Running system context explicitly wants the database name to be generated
            if (configuration.IsTestDatabaseNameDynamic())
            {
                return $"{connectionStringBuilder.InitialCatalog}-{DateTimeOffset.Now:yyyyMMdd-HHmmss}";
            }

            return databaseName;
        }

        /// <summary>
        /// Whether the test runner is to generate a dynamic database name for each test suite run
        /// </summary>
        /// <param name="configuration">If 'TEST_DATABASE_NAME' is set to 'generate', it will dynamically create a unique database</param>
        /// <returns>Whether or not the database name is dynamic</returns>
        public static bool IsTestDatabaseNameDynamic(this IConfigurationRoot configuration)
        {
            return false;
            // Until we decide how we want to configure this
            // var databaseName = Environment.GetEnvironmentVariable("TEST_DATABASE_NAME");
            // return !string.IsNullOrWhiteSpace(databaseName) && databaseName.ToLower() == "generate";
        }
    }
}