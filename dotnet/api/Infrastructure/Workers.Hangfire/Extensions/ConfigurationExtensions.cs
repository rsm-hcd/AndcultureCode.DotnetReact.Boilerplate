using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AndcultureCode.GB.Business.Core.Models.Configuration;
using AndcultureCode.GB.Infrastructure.Workers.Hangfire.Filters;
using AndcultureCode.GB.Infrastructure.Workers.Hangfire.Providers;
using System;
using AndcultureCode.CSharp.Core.Constants;
using AndcultureCode.CSharp.Core.Utilities.Configuration;
using AndcultureCode.CSharp.Core.Interfaces.Providers.Worker;

namespace AndcultureCode.GB.Infrastructure.Workers.Hangfire.Extensions
{
    public static class ConfigurationExtensions
    {
        /// <summary>
        /// Configures Services collection to use hangfire worker provider.
        /// </summary>
        /// <param name="services">Application's services collection instance</param>
        /// <param name="variant">While this will likely be your environment name (Development, Production, etc...), it could be any custom 'appsettings.{variant}.json' as well.</param>
        public static IServiceCollection AddBackgroundWorkers(this IServiceCollection services, IConfigurationRoot config)
        {
            var workerConfig = config.GetSection("WorkersHangfire").Get<HangfireWorkerConfiguration>();
            var connectionString = ConfigurationUtils.GetConnectionString();
            var sqlOptions = new SqlServerStorageOptions
            {
                CommandBatchMaxTimeout = TimeSpan.FromMinutes(workerConfig.SqlServerOptions.CommandBatchMaxTimeout),
                DisableGlobalLocks = workerConfig.SqlServerOptions.DisableGlobalLocks,
                QueuePollInterval = TimeSpan.FromMinutes(workerConfig.SqlServerOptions.QueuePollInterval),
                SlidingInvisibilityTimeout = TimeSpan.FromMinutes(workerConfig.SqlServerOptions.SlidingInvisibilityTimeout),
                UsePageLocksOnDequeue = workerConfig.SqlServerOptions.UsePageLocksOnDequeue,
                UseRecommendedIsolationLevel = workerConfig.SqlServerOptions.UseRecommendedIsolationLevel
            };

            services.AddBackgroundWorkerDependencies();

            Console.WriteLine($"Connecting to Hangfire SqlServer Storage => {connectionString}");

            services.AddHangfire(configuration => configuration
                            .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                            .UseSimpleAssemblyNameTypeSerializer()
                            .UseRecommendedSerializerSettings()
                            .UseSqlServerStorage(connectionString, sqlOptions));

            // Add the processing server as IHostedService
            services.AddHangfireServer();

            return services;
        }

        public static IServiceCollection AddBackgroundWorkerDependencies(this IServiceCollection services)
        {
            services.AddScoped<IWorkerProvider, HangfireWorkerProvider>();

            return services;
        }

        /// <summary>
        /// Configures this application to leverage a combination of the background worker Dashboard UI and/ or Processing Server
        /// </summary>
        public static void UseBackgroundWorkerServer(this IApplicationBuilder app, IConfigurationRoot configuration)
        {

            var workerConfiguration = configuration.GetSection("WorkersHangfire").Get<HangfireWorkerConfiguration>();

            if (workerConfiguration.IsDashboardEnabled)
            {
                app.UseHangfireDashboard(options: new DashboardOptions
                {
                    Authorization = new[] { new DashboardAuthorizationFilter() }
                });
            }

            if (workerConfiguration.IsServerEnabled)
            {
                var queues = workerConfiguration.Queues == null ? Queue.ALL : workerConfiguration.Queues;
                Console.WriteLine($"Hangfire Server processing queues [{string.Join(", ", queues)}]");

                app.UseHangfireServer(new BackgroundJobServerOptions
                {
                    Queues = queues,
                    WorkerCount = workerConfiguration.WorkerCount
                });
            }
        }
    }
}
