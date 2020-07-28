using System;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Seeds;
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

        public static void ConfigureDatabase(this IApplicationBuilder app, IHostEnvironment env, IServiceScope serviceScope)
        {
            if (env.IsEnvironment("Testing"))
            {
                return;
            }

            var serviceProvider = serviceScope.ServiceProvider;
            var context = serviceProvider.GetService<GBApiContext>();
            var logger = serviceProvider.GetService<ILogger<IApplicationBuilder>>();

            Migrate(context.Database, logger);
            Seed(serviceProvider, env, logger);
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
