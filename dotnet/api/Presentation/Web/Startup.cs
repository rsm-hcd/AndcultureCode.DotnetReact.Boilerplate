using AspNetCoreRateLimit;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using AndcultureCode.GB.Business.Core.Extensions.Startup;
using AndcultureCode.GB.Infrastructure.Workers.Hangfire.Extensions;
using AndcultureCode.GB.Presentation.Web.Extensions.Startup;
using AndcultureCode.GB.Presentation.Web.Filters.Validation;
using AndcultureCode.GB.Presentation.Web.Models.Dtos;
using System;
using System.IO;
using System.Reflection;
using AndcultureCode.GB.Presentation.Web.Filters.Swagger;
using AndcultureCode.GB.Presentation.Web.Constants;
using Microsoft.OpenApi.Models;
using AndcultureCode.CSharp.Web.Extensions;
using AndcultureCode.CSharp.Extensions;
using AndcultureCode.CSharp.Core.Utilities.Configuration;
using AndcultureCode.CSharp.Core.Interfaces.Providers.Worker;
using AndcultureCode.CSharp.Data.Extensions;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Seeds;

namespace AndcultureCode.GB.Presentation.Web
{
    public class Startup
    {
        #region Constants

        public const string FRONTEND_DEVELOPMENT_SERVER_URL = "http://localhost:3000";
        public const string FRONTEND_STATIC_CONTENT_PATH = "wwwroot";

        #endregion Constants


        #region Properties

        public IConfigurationRoot _configuration { get; }
        public IHostEnvironment _environment { get; }
        public IStringLocalizer _localizer { get; set; }

        #endregion Properties


        #region Constructor

        public Startup(IHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                builder.AddUserSecrets<Program>();
            }

            _configuration = builder.Build();
            _environment = env;

            ConfigurationUtils.SetConfiguration(_configuration);
            ConfigurationUtils.GetConnectionString();
        }

        #endregion Constructor


        #region Public Methods

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(config =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();

                config.Filters.Add(new AuthorizeFilter(policy));
                config.Filters.Add(new ValidationFilter());
            })
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
                .AddFluentValidation(fvc => fvc.RegisterValidatorsFromAssemblyContaining<Startup>())
                .AddViewLocalization().AddDataAnnotationsLocalization();

            services.AddAndcultureCodeLocalization();
            services.AddApi(_configuration, _environment);
            services.AddBackgroundWorkers(_configuration);
            services
                .AddCookieAuthentication(_configuration)
                .AddGoogleOAuth(_configuration)
                .AddMicrosoftOAuth(_configuration);
            services.AddForwardedHeaders();
            services.AddSerilogServices(_configuration);

            // Caching
            services.AddMemoryCache();
            services.AddResponseCaching();

            // Documentation Generation
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = Api.TITLE, Version = $"v{Api.VERSION}" });

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

                c.IncludeXmlComments(xmlPath);
                c.DocumentFilter<LocalizationDocumentFilter>();
                c.SchemaFilter<AuditableSchemaFilter>();
            });

            // SPA services
            services.AddSpaStaticFiles(config => config.RootPath = FRONTEND_STATIC_CONTENT_PATH);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IHostEnvironment env,
            IWorkerProvider workerProvider,
            IOptions<RequestLocalizationOptions> requestOptions
        )
        {
            var version = _configuration.GetVersion(env.IsDevelopment());
            Console.WriteLine($"{Api.TITLE} Version: {version}");

            app.UseRewriter();

            // per AspNetCoreRateLimitMiddleware docs:
            // "You should register the middleware before any other components."
            // https://github.com/stefanprodan/AspNetCoreRateLimit/wiki/IpRateLimitMiddleware#setup
            app.UseIpRateLimiting();

            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var serviceProvider = serviceScope.ServiceProvider;
                var seeds = new Seeds(serviceProvider, env.IsDevelopment());

                app.ConfigureDatabase(
                    serviceProvider,
                    migrate: true,
                    seeds
                );
            }

            app.UseForwardedHeaders();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseBackgroundWorkerServer(_configuration);
            app.UseGlobalExceptionHandler();
            app.UseHttpsRedirection();

            // Caching
            app.UseResponseCaching();

            // Documentation generation
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", $"{Api.TITLE} V{Api.VERSION}");
                c.RoutePrefix = Api.DOCUMENTATION_RELATIVE_URL;
            });

            // Internationlization
            app.UseRequestLocalization(requestOptions.Value);

            // SPA static file routing
            app.UseSpaStaticFiles(); // Should be called before UseRouting/UseEndpoints

            // Backend MVC route mapping - Default/bare route "/" falls through to SPA
            app.UseRouting(); // Adds metadata to controllers based upon request path

            // Authentication and authorization middleware should be configured here
            app.UseCookieAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(routes =>
            {
                routes.MapControllerRoute(
                    name: "mvc controllers",
                    pattern: "{controller}/{action=Index}/{id?}"
                );

                // In non-development environments, the backend wraps the home ("/") route in authorization handling
                if (!env.IsDevelopment())
                {
                    routes.MapFallbackToController(action: "Index", controller: "Home"); // Home Controller handles authorization
                }
            });

            // Configure SPA routing
            // ------------------------------------------------------------------------------------
            // - In development, "/" is proxied to webpack dev server
            // - In non-development, "/" serves a compiled version of react's index.html from /wwwroot.
            //   with all javascript, css and image assets absolutely referenced in Amazon CloudFront/S3
            app.UseSpa(spa =>
            {
                if (env.IsDevelopment())
                {
                    Console.WriteLine($"Proxying frontend from {FRONTEND_DEVELOPMENT_SERVER_URL}");
                    spa.UseProxyToSpaDevelopmentServer(FRONTEND_DEVELOPMENT_SERVER_URL);
                }
            });

            // Register Background Jobs
            ConfigureBackgroundJobs(app, env, workerProvider);
        }

        public virtual void ConfigureBackgroundJobs(
            IApplicationBuilder app,
            IHostEnvironment env,
            IWorkerProvider workerProvider
        )
        {
            if (env.IsEnvironment("Testing"))
            {
                return;
            }

            Console.WriteLine("[IWorkerProviderExtensions.RegisterBackgroundJobs] Starting Registering Background Jobs");

            // workerProvider.RegisterSomeJob();

            Console.WriteLine("[IWorkerProviderExtensions.RegisterBackgroundJobs] Completed Registering Background Jobs");
        }

        #endregion Public Methods
    }
}
