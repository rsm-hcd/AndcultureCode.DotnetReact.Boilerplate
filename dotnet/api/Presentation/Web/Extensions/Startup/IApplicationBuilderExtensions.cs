using System;
using AndcultureCode.CSharpCore.Constants;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Seeds;
using Core.Constants;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AndcultureCode.GB.Presentation.Web.Extensions.Startup
{
    public static class IApplicationBuilderExtensions
    {
        #region Public Methods

        /// <summary>
        /// Performs application startup related database configuration tasks
        /// </summary>
        /// <param name="app"></param>
        /// <param name="serviceProvider"></param>
        /// <param name="migrate">Should outstanding code-first migrations be run?</param>
        /// <param name="seed">Should seed data be evaluated?</param>
        public static void ConfigureDatabase(
            this IApplicationBuilder app,
            IServiceProvider serviceProvider,
            bool migrate = true,
            bool seed = true
        )
        {
            var env = serviceProvider.GetService<IHostEnvironment>();
            if (env.IsEnvironment(EnvironmentConstants.TESTING))
            {
                return;
            }

            var context = serviceProvider.GetService<GBApiContext>();
            var logger = serviceProvider.GetService<ILogger<IApplicationBuilder>>();

            if (migrate)
            {
                Migrate(context.Database, logger);
            }

            if (seed)
            {
                Seed(serviceProvider, env, logger);
            }
        }

        #endregion Public Methods

        #region Private Methods

        private static void Migrate(DatabaseFacade database, ILogger<IApplicationBuilder> logger)
        {
            logger.LogInformation("Migrating database...");
            database.SetCommandTimeout(int.MaxValue);
            database.Migrate();
            logger.LogInformation("Database migrated");
        }

        private static void Seed(IServiceProvider serviceProvider, IHostEnvironment env, ILogger<IApplicationBuilder> logger)
        {
            logger.LogInformation("Seeding database...");
            var seeds = new Seeds(serviceProvider, env.IsDevelopment());
            seeds.Create();
            logger.LogInformation("Database seeded");
        }

        #endregion Private Methods
    }
}
