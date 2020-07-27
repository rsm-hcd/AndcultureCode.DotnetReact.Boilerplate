using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AndcultureCode.GB.Business.Core.Providers.Logging;
using Serilog;

namespace AndcultureCode.GB.Business.Core.Extensions.Startup
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddSerilogServices(this IServiceCollection services, IConfiguration configuration)
        {
            Log.Logger = new LoggingProvider(configuration).GetLogger();
            AppDomain.CurrentDomain.ProcessExit += (s, e) => Log.CloseAndFlush();
            return services.AddSingleton(Log.Logger);
        }
    }
}
