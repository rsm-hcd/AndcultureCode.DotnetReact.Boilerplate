using Microsoft.Extensions.Configuration;
using Serilog;
using AndcultureCode.CSharp.Core.Providers.Configuration;

namespace AndcultureCode.GB.Business.Core.Providers.Logging
{
    public class LoggingProvider
    {
        #region Private Properties

        private readonly IConfiguration _config;

        #endregion Private Properties

        #region Public Methods

        public LoggingProvider(IConfiguration config = null)
        {
            _config = config ?? new LocalConfigurationProvider().GetConfiguration();
        }

        public Serilog.ILogger GetLogger() => new LoggerConfiguration()
                .ReadFrom.Configuration(_config)
                .CreateLogger();
    }

    #endregion Public Methods
}