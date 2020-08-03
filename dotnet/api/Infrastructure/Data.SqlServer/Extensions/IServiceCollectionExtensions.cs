using AndcultureCode.CSharp.Business.Core.Models.Configuration;
using AndcultureCode.CSharp.Core.Interfaces.Data;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddSqlServer(this IServiceCollection services)
        {
            // Repositories
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            return services;
        }
    }
}
