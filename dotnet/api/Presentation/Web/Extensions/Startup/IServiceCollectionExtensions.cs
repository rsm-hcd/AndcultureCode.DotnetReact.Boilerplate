using AndcultureCode.CSharp.Core.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AndcultureCode.GB.Business.Conductors.Extensions.Startup;
using AndcultureCode.GB.Business.Core.Interfaces.Data;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions;
using AndcultureCode.GB.Presentation.Web.Models;
using Serilog;
using Serilog.Extensions.Logging;
using System;
using AndcultureCode.GB.Presentation.Worker.Extensions;
using AspNetCoreRateLimit;
using Microsoft.Extensions.Hosting;
using AndcultureCode.GB.Presentation.Web.Middleware.Localization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.Routing;
using AndcultureCode.GB.Presentation.Web.Constants;
using AndcultureCode.CSharp.Core.Utilities.Localization;
using AndcultureCode.CSharp.Extensions;
using AndcultureCode.CSharp.Core.Models.Mail;
using AndcultureCode.CSharp.Core.Models.Configuration;
using AndcultureCode.CSharp.Web.Constants;
using AndcultureCode.CSharp.Core.Constants;
using AndcultureCode.CSharp.Core.Extensions;

namespace AndcultureCode.GB.Presentation.Web.Extensions.Startup
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddApi(this IServiceCollection services, IConfigurationRoot configuration, IHostEnvironment environment)
        {
            services
                .AddAutoMapper(typeof(MappingProfile))
                .AddConfiguration(
                        configuration,
                        environment.ContentRootPath,
                        environment.EnvironmentName
                    )
                .AddContexts(configuration, environment.EnvironmentName)
                .AddSeeding(configuration)
                .AddSqlServer()
                .AddConductors(configuration)
                .AddProviders()
                .AddClients(configuration)
                .AddWorkers()
                .AddMiddleware(configuration);

            return services;
        }

        public static IServiceCollection AddClients(this IServiceCollection services, IConfigurationRoot configuration)
        {
            // services.AddScoped<IRestClient, RestClient>(); // RestSharp

            return services;
        }

        public static IServiceCollection AddConfiguration(this IServiceCollection services,
            IConfigurationRoot configuration,
            string contentRootPath,
            string environmentName
        )
        {
            var authenticationSection = configuration.GetSection(WebConfiguration.AUTHENTICATION);

            // Register Configuration Instance
            services
                .AddSingleton<IConfigurationRoot>(configuration)
                .AddSingleton((sp) => authenticationSection.GetSection(WebConfiguration.AUTHENTICATION_BASIC).Get<BasicAuthenticationConfiguration>())
                .AddSingleton((sp) => configuration.GetSection("Email").Get<EmailSettings>());

            return services;
        }

        public static IServiceCollection AddContexts(this IServiceCollection services, IConfigurationRoot configuration, string environmentName)
        {
            var connectionString = configuration.GetDatabaseConnectionString();
            var isTestingEnvironment = environmentName.ToLower() == EnvironmentConstants.TESTING.ToLower();
            var loggerFactory = isTestingEnvironment ? null : new SerilogLoggerFactory(Log.Logger, false);

            // Context gets registered several different ways (will this still be the same instance in the single scope?)
            services
                .AddDbContext<GBApiContext>(ServiceLifetime.Scoped)
                .AddScoped((sp) => new GBApiContext(connectionString, loggerFactory))
                .AddScoped<GBApiContext>((sp) => new GBApiContext(connectionString, loggerFactory))
                .AddScoped<IContext>((sp) => new GBApiContext(connectionString, loggerFactory))
                .AddScoped<IGBApiContext>((sp) => new GBApiContext(connectionString, loggerFactory))
                .AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            return services;
        }

        public static IServiceCollection AddAndcultureCodeLocalization(this IServiceCollection services)
        {
            var localizerFactory = new JsonStringLocalizerFactory();
            services.AddScoped<IStringLocalizer>((sp) => localizerFactory.Create(null));

            // Configuration of services
            services
                .ConfigureRequestLocalizationOptions()
                .ConfigureRewriteOptions()
                .ConfigureRouteOptions();

            return services;
        }

        public static IServiceCollection AddMiddleware(this IServiceCollection services, IConfigurationRoot configuration)
        {
            services
                .Configure<IpRateLimitOptions>(configuration.GetSection("IpRateLimiting"))
                .AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>()
                .AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>()
                .AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

            return services;
        }

        public static IServiceCollection AddProviders(this IServiceCollection services)
        {
            // services.AddScoped<IEmailProvider, XYZEmailProvider>();

            return services;
        }

        public static IServiceCollection ConfigureRequestLocalizationOptions(this IServiceCollection services)
            => services.Configure<RequestLocalizationOptions>(options =>
        {
            options.DefaultRequestCulture = new RequestCulture
            (
                culture: LocalizationUtils.DefaultCultureInfo,
                uiCulture: LocalizationUtils.DefaultCultureInfo
            );

            options.RequestCultureProviders = new[]
            {
                new JsonRequestCultureProvider
                {
                    IndexOfCulture = 1,  //  0                  /1        /2  /3        /4-N
                    IndexOfUiCulture = 1 //  {protocol://domain}/{culture}/api/{version}/{controller}...
                }
            };

            options.SupportedCultures = LocalizationUtils.CultureInfos;
            options.SupportedUICultures = LocalizationUtils.CultureInfos;
        });

        public static IServiceCollection ConfigureRewriteOptions(this IServiceCollection services)
            => services.Configure<RewriteOptions>(options =>
        {
            // If the versioned API route does not have a culture, rewrite to default
            options.AddRewrite(
                regex:
                    "^(?!\\/{0,1}[a-zA-Z]{2}-[a-zA-Z]{2})" + // Do NOT '?!' rewrite, if string starts with '^' culture of format 'az-AZ'
                    "\\/{0,1}" + Api.VERSION_PREFIX +        // Must be a versioned api branch of routing (ignore everything else - ie. SPA, static files, MVC routes)
                    "(.*)$",                                 // Capture group to preserve the unique portion of the route
                replacement: $"{LocalizationUtils.DefaultCultureCode.ToLower()}/{Api.VERSION_PREFIX}$1",
                skipRemainingRules: false
            );
        });

        public static IServiceCollection ConfigureRouteOptions(this IServiceCollection services)
            => services.Configure<RouteOptions>(options =>
        {
            options.ConstraintMap.Add(Api.ROUTING_CULTURE_CONSTRAINT, typeof(CultureRouteConstraint));
        });
    }
}
