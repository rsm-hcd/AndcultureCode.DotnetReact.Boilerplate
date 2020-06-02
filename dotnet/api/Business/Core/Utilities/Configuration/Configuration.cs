using AndcultureCode.CSharp.Core.Extensions;
using Microsoft.Extensions.Configuration;

namespace AndcultureCode.GB.Business.Core.Utilities.Configuration
{
    /// <summary>
    /// Static utility class to aid in configuration
    /// </summary>
    public static class Configuration
    {
        #region Properties

        private static IConfigurationBuilder _builder;
        private static IConfigurationRoot _configurationRoot;
        private static string _connectionString;

        public static IConfigurationBuilder Builder
        {
            get
            {
                if (_builder == null)
                {
                    _builder = new ConfigurationBuilder()
                        .AddJsonFile("appsettings.json")
                        .AddAmazonElasticBeanstalk()
                        .AddEnvironmentVariables();
                }
                return _builder;
            }
        }

        #endregion Properties


        #region Public Methods

        public static IConfigurationRoot GetConfiguration() => _configurationRoot ?? (_configurationRoot = Builder.Build());

        public static string GetConnectionString(string name = ApplicationConstants.DATABASE_CONFIGURATION_KEY)
        {
            if (!string.IsNullOrWhiteSpace(_connectionString))
            {
                return _connectionString;
            }

            // Note: Using colon vs underscore results in only the appsettings file being read and not the environment variable
            return GetConfiguration().GetSection("ConnectionStrings").GetValue<string>(name);
        }

        public static void SetConfiguration(IConfigurationRoot configuration) => _configurationRoot = configuration;

        /// <summary>
        /// Explicitly set connection string at runtime. When set at runtime, this superceeds
        /// values from the loaded configurationRoot object.
        /// </summary>
        /// <param name="connectionString"></param>
        public static void SetConnectionString(string connectionString) => _connectionString = connectionString;

        #endregion Public Methods
    }
}
