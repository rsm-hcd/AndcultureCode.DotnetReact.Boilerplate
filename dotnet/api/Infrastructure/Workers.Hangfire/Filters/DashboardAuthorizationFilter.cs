using Hangfire.Annotations;
using Hangfire.Dashboard;

namespace AndcultureCode.GB.Infrastructure.Workers.Hangfire.Filters
{
    public class DashboardAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize([NotNull] DashboardContext context)
        {
            var httpContext = context.GetHttpContext();
            return true;
        }
    }
}