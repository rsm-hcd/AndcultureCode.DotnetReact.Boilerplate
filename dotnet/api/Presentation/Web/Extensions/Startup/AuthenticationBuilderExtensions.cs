using System.Threading.Tasks;
using AndcultureCode.CSharp.Business.Core.Models.Configuration;
using AndcultureCode.CSharp.Web.Constants;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Web.Extensions.Startup
{
    public static class AuthenticationBuilderExtensions
    {

        /// <summary>
        /// Register cookie authentication related actors
        /// </summary>
        /// <param name="services"></param>
        /// <param name="config"></param>
        public static AuthenticationBuilder AddCookieAuthentication(this AuthenticationBuilder services, CookieAuthenticationConfiguration config)
        {
            // Configuration
            var cookie = new CookieBuilder
            {
                Name = config.CookieName,
                SameSite = SameSiteMode.Lax
            };

            var cookieEvents = new CookieAuthenticationEvents
            {
                OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = 403; // Don't redirect, set to forbidden
                    return Task.CompletedTask;
                },
                OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401; // Don't redirect, set to unauthorized
                    return Task.CompletedTask;
                }
            };

            // Register actors
            return services
                // .AddAuthentication(cookieConfig.AuthenticationScheme)
                .AddCookie(config.AuthenticationScheme, options =>
                {
                    options.AccessDeniedPath = new PathString(config.AccessDeniedPath);
                    options.Cookie = cookie;
                    options.Events = cookieEvents;
                    options.LoginPath = new PathString(config.LoginPath);
                });
        }

    }
}
