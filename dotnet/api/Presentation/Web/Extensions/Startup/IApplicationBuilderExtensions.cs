using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Seeds;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AndcultureCode.GB.Presentation.Web.Extensions.Startup
{
    public static class IApplicationBuilderExtensions
    {
        public static void InitializeDatabase(this IApplicationBuilder app, IHostEnvironment env, IServiceScope serviceScope)
        {
            if (env.IsEnvironment("Testing"))
            {
                return;
            }

            var serviceProvider = serviceScope.ServiceProvider;
            var context = serviceProvider.GetService<GBApiContext>();
            var logger = serviceProvider.GetService<ILogger<IApplicationBuilder>>();

            // Migrate
            logger.LogInformation("Migrating database...");
            context.Database.SetCommandTimeout(int.MaxValue);
            context.Database.Migrate();
            logger.LogInformation("Database migrated.");

            // Seed
            logger.LogInformation("Seeding database...");
            var seeds = new Seeds(logger, context, env.IsDevelopment());
            seeds.Create();
            logger.LogInformation("Database seeded.");
        }
    }
}
