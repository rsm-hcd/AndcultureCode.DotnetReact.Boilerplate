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
using Microsoft.AspNetCore.HttpOverrides;
using AndcultureCode.CSharp.Core.Utilities.Localization;
using AndcultureCode.CSharp.Extensions;
using AndcultureCode.CSharp.Core.Models.Mail;
using AndcultureCode.CSharp.Core.Models.Configuration;
using AndcultureCode.GB.Business.Core.Models.Configuration;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Threading.Tasks;

namespace AndcultureCode.GB.Presentation.Web.Extensions.Startup
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddApi(this IServiceCollection services, IConfigurationRoot configuration, IHostEnvironment environment)
        {
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddConfiguration(
                configuration,
                environment.ContentRootPath,
                environment.EnvironmentName
            );
            services.AddContexts(configuration, environment.EnvironmentName);
            services.AddSqlServer(configuration);
            services.AddConductors(configuration);
            services.AddProviders();
            services.AddClients(configuration);
            services.AddWorkers();
            services.AddMiddleware(configuration);

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
            var authenticationSection = configuration.GetSection("Authentication");

            // Register Configuration Instance
            services.AddSingleton<IConfigurationRoot>(configuration);
            services.AddSingleton((sp) => authenticationSection.GetSection("Basic").Get<BasicAuthenticationConfiguration>());
            services.AddSingleton((sp) => authenticationSection.GetSection("Cookie").Get<CookieAuthenticationConfiguration>());
            services.AddSingleton((sp) => configuration.GetSection("Email").Get<EmailSettings>());

            return services;
        }

        public static IServiceCollection AddContexts(this IServiceCollection services, IConfigurationRoot configuration, string environmentName)
        {
            var connectionString = configuration.GetDatabaseConnectionString();

            var loggerFactory = environmentName.ToLower() == "testing" ? null : new SerilogLoggerFactory(Log.Logger, false);

            // Context gets registered several different ways (will this still be the same instance in the single scope?)
            services.AddDbContext<GBApiContext>(ServiceLifetime.Scoped);
            services.AddScoped((sp) => new GBApiContext(connectionString, loggerFactory));
            services.AddScoped<GBApiContext>((sp) => new GBApiContext(connectionString, loggerFactory));
            services.AddScoped<IContext>((sp) => new GBApiContext(connectionString, loggerFactory));
            services.AddScoped<IGBApiContext>((sp) => new GBApiContext(connectionString, loggerFactory));

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            return services;
        }

        public static IServiceCollection AddAndcultureCodeLocalization(this IServiceCollection services)
        {
            var localizerFactory = new JsonStringLocalizerFactory();
            services.AddScoped<IStringLocalizer>((sp) => localizerFactory.Create(null));

            // Configuration of services
            services.ConfigureRequestLocalizationOptions()
                    .ConfigureRewriteOptions()
                    .ConfigureRouteOptions();

            Console.WriteLine($"Default Localization Culture: {LocalizationUtils.DefaultCultureCode}");
            Console.WriteLine($"Localization Cultures: {LocalizationUtils.CultureCodes(", ")}");

            return services;
        }

        /// <summary>
        /// Adds cookie authentication
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        public static void AddCookieAuthentication(this IServiceCollection services, IConfigurationRoot configuration)
        {
            var config = configuration.GetSection("Authentication").GetSection("Cookie").Get<CookieAuthenticationConfiguration>();
            var cookie = new CookieBuilder
            {
                Name = config.CookieName,
                SameSite = SameSiteMode.Lax
            };
            var cookieEvents = new CookieAuthenticationEvents
            {
                OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = 403; // Don't redirect, set to forbidden
                    return Task.CompletedTask;
                },
                OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401; // Don't redirect, set to unauthorized
                    return Task.CompletedTask;
                }
            };

            services
                .AddAuthentication(config.AuthenticationScheme)
                .AddCookie(config.AuthenticationScheme, options =>
                {
                    options.AccessDeniedPath = new PathString(config.AccessDeniedPath);
                    options.Cookie = cookie;
                    options.Events = cookieEvents;
                    options.LoginPath = new PathString(config.LoginPath);
                });
        }

        public static IServiceCollection AddMiddleware(this IServiceCollection services, IConfigurationRoot configuration)
        {
            services.Configure<IpRateLimitOptions>(configuration.GetSection("IpRateLimiting"));

            services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
            services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
            services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

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

        /// <summary>
        /// Enables HTTP Header forwarding for proxies. This is not enabled by default when hosting out of process (i.e kestrel)
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection ConfigureForwardedHeaders(this IServiceCollection services)
            => services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });
    }
}
