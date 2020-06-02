using System;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace AndcultureCode.GB.Business.Core.Providers.Configuration
{
    public class LocalConfigurationProvider
    {
        #region Private Properties

        private readonly string _basePath = Directory.GetCurrentDirectory();

        #endregion Private Properties

        #region Public Methods

        public LocalConfigurationProvider(string basePath = null)
        {
            if (!string.IsNullOrWhiteSpace(basePath))
            {
                _basePath = basePath;
            }
        }

        public IConfiguration GetConfiguration()
        {
            return new ConfigurationBuilder()
                    .SetBasePath(this._basePath)
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
                    .AddEnvironmentVariables()
                    .Build();
        }

        #endregion Public Methods
    }
}