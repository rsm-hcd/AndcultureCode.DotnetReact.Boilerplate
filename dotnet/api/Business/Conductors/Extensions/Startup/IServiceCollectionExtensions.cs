using AndcultureCode.CSharp.Conductors;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using Microsoft.Extensions.DependencyInjection;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Jobs;
using AndcultureCode.GB.Business.Conductors.Domain.Jobs;
using Microsoft.Extensions.Configuration;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Domain.Users;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Business.Conductors.Domain.UserLogins;

namespace AndcultureCode.GB.Business.Conductors.Extensions.Startup
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddConductors(this IServiceCollection services, IConfigurationRoot configuration)
        {
            // Job
            services.AddScoped<IJobEnqueueConductor, JobEnqueueConductor>();

            // Users
            services.AddScoped<IUserLoginConductor<User>, UserLoginConductor<User>>();

            // Repository defaults - Should appear last
            services.AddScoped(typeof(IRepositoryCreateConductor<>), typeof(RepositoryCreateConductor<>));
            services.AddScoped(typeof(IRepositoryReadConductor<>), typeof(RepositoryReadConductor<>));
            services.AddScoped(typeof(IRepositoryUpdateConductor<>), typeof(RepositoryUpdateConductor<>));
            services.AddScoped(typeof(IRepositoryDeleteConductor<>), typeof(RepositoryDeleteConductor<>));
            services.AddScoped(typeof(IRepositoryConductor<>), typeof(RepositoryConductor<>));

            return services;
        }
    }
}
