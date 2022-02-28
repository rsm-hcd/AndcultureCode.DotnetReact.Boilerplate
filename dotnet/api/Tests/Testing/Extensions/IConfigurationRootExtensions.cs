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
        public static string GetTestDatabaseName(this IConfigurationRoot configuration, string collectionName)
        {
            var connection = configuration.GetDatabaseConnectionStringBuilder();
            return $"GBTest-{collectionName}";
        }


    }
}