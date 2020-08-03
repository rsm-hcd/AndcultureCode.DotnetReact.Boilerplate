using Microsoft.Extensions.DependencyInjection;

namespace AndcultureCode.GB.Presentation.Worker.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddWorkers(this IServiceCollection services)
        {
            // Workers
            // services.AddScoped<IWorker, XYZWorker>();
            // services.AddScoped<IXYZWorker, XYZWorker>();

            return services;
        }
    }
}
