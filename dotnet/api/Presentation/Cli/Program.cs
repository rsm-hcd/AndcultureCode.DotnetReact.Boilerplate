using System;
using System.IO;
using AutoMapper;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AndcultureCode.GB.Business.Conductors.Extensions.Startup;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions;
using AndcultureCode.GB.Presentation.Web.Extensions.Startup;
using AndcultureCode.GB.Presentation.Web.Models;
using AndcultureCode.CSharp.Core.Utilities.Configuration;

namespace AndcultureCode.GB.Presentation.Cli
{
    class Program
    {
        #region Constants

        public const int FAILED = 1;
        public const int SUCCESSFUL = 0;

        #endregion Constants


        #region Properties

        private static CommandLineApplication _app;
        private static IConfigurationRoot _cachedConfiguration;
        private static GBApiContext _cachedContext;
        private static IServiceCollection _cachedServiceCollection;
        // private static IServiceProvider    _cachedServiceProvider;

        private static IConfigurationRoot _configuration
        {
            get
            {
                if (_cachedConfiguration != null)
                {
                    return _cachedConfiguration;
                }

                var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .AddJsonFile("appsettings.cli.json", optional: false, reloadOnChange: true)
                    .AddEnvironmentVariables();

                _cachedConfiguration = builder.Build();
                ConfigurationUtils.SetConfiguration(_cachedConfiguration);
                ConfigurationUtils.GetConnectionString();

                return _cachedConfiguration;
            }
        }

        private static GBApiContext _context
        {
            get
            {
                if (_cachedContext != null)
                {
                    return _cachedContext;
                }

                _cachedContext = new GBApiContext();
                _cachedContext.Database.SetCommandTimeout(0);
                return _cachedContext;
            }
        }

        private static string _environmentName
        {
            get
            {
                var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                return string.IsNullOrWhiteSpace(environmentName) ? "Development" : environmentName;
            }
        }

        private static IServiceCollection _serviceCollection
        {
            get
            {
                if (_cachedServiceCollection != null)
                {
                    return _cachedServiceCollection;
                }

                _cachedServiceCollection = new ServiceCollection()
                    .AddLogging()
                    // .AddAutoMapper(typeof(MappingProfile))
                    .AddConfiguration(_configuration, "", _environmentName)
                    .AddContexts(_configuration, _environmentName)
                    .AddSqlServer()
                    .AddConductors(_configuration);

                return _cachedServiceCollection;
            }
        }

        #endregion Properties


        #region Public Methods

        public static int Main(string[] args)
        {
            // Log.Logger = new LoggingProvider(new LocalConfigurationProvider().GetConfiguration()).GetLogger();

            // Configure Console application
            _app = new CommandLineApplication
            {
                Description = "Dotnet specific series of commands giving easier access to operators",
                Name = "cli"
            };

            _app.HelpOption(inherited: true);


            _app.OnExecute(() => DefaultResponse(_app));

            return _app.Execute(args);
        }

        #endregion Public Methods


        #region Private Methods

        private static int DefaultResponse(CommandLineApplication app)
        {
            Console.WriteLine("Specify a sub-command");
            app.ShowHelp();
            return SUCCESSFUL;
        }

        #endregion Private Methods
    }
}
