using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AndcultureCode.GB.Presentation.Web.Extensions.Startup
{
    public static class IApplicationBuilderExtensions
    {
        //TODO: Implement ConfigureMiddleWare for Testing environment
        public static void ConfigureSeedData(this IApplicationBuilder app, IHostEnvironment env, IServiceScope serviceScope)
        {
            if (env.IsEnvironment("Testing"))
            {
                return;
            }

            var context = serviceScope.ServiceProvider.GetService<GBApiContext>();
            context.Database.SetCommandTimeout(int.MaxValue);
            context.Database.Migrate();
            context.EnsureSeedData(true);
        }
    }
}
