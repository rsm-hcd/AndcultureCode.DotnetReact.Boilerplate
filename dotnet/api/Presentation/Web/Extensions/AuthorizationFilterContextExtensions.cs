using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace AndcultureCode.GB.Presentation.Web.Extensions
{
    public static class AuthorizationFilterContextExtensions
    {
        /// <summary>
        /// Convenience method to get dependency injected resources
        /// </summary>
        /// <param name="context"></param>
        /// <typeparam name="T"></typeparam>
        public static T GetService<T>(this AuthorizationFilterContext context)
            => context.HttpContext.RequestServices.GetRequiredService<T>();
    }
}