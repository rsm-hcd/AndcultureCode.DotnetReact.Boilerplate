using System;
using Microsoft.Extensions.Configuration;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.CSharp.Core.Constants;

namespace Testing.Extensions
{
    public static class IConfigurationRootExtensions
    {
        /// <summary>
        /// Requires the appsettings.json/environment variables
        /// configure the ConnectionStrings__GBApi in an object format.
        /// Not a delimited string.
        /// </summary>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public static GBApiConnection GetDatabaseConnection(this IConfigurationRoot configuration)
        {
            var section = configuration
                .GetSection("ConnectionStrings")
                .GetSection(ApplicationConstants.API_DATABASE_CONFIGURATION_KEY)
                .Get<GBApiConnection>();

            if (section == null)
            {
                throw new Exception("[IConfigurationRootExtensions.GetGBApiConnection] Ensure appsettings loaded provide GBApi connection string in the object format (like the web.test project)");
            }

            return section;
        }

        /// <summary>
        /// Retrieves an GBApiConnection configured to work with the test database.
        ///
        /// Requires the appsettings.json/environment variables
        /// configure the ConnectionStrings__GBApi in an object format.
        /// Not a delimited string.
        /// </summary>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public static GBApiConnection GetTestDatabaseConnection(this IConfigurationRoot configuration)
        {
            var connection = configuration.GetDatabaseConnection();
            connection.Database = configuration.GetTestDatabaseName();
            return connection;
        }

        public static string GetTestDatabaseName(this IConfigurationRoot configuration)
        {
            var connection = configuration.GetDatabaseConnection();
            var databaseName = Environment.GetEnvironmentVariable("TEST_DATABASE_NAME");

            // When a test database name isn't specified, we default it for the runner
            if (string.IsNullOrWhiteSpace(databaseName))
            {
                return "GravityBootsApi-Test";
            }

            // Running system context explicitly wants the database name to be generated
            if (configuration.IsTestDatabaseNameDynamic())
            {
                return $"{connection.Database}-{DateTimeOffset.Now:yyyyMMdd-HHmmss}";
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