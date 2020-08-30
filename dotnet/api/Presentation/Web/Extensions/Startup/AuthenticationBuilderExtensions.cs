using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AndcultureCode.CSharp.Business.Core.Models.Configuration;
using AndcultureCode.CSharp.Core.Interfaces.Authentication;
using AndcultureCode.CSharp.Web.Constants;
using AndcultureCode.CSharp.Web.Middleware;
using AndcultureCode.CSharp.Web.Models.Dtos.Authentication;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Presentation.Web.Constants;
using AndcultureCode.GB.Presentation.Web.Middleware.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AndcultureCode.GB.Presentation.Web.Extensions.Startup
{
    #region Public Methods

    /// <summary>
    /// Extensions methods for AuthenticationBuilder
    /// </summary>
    public static class AuthenticationBuilderExtensions
    {
        /// <summary>
        /// Configure Google OpenID Authentication if it is enabled
        /// </summary>
        /// <remarks>
        /// Remember to configure 'UseAuthorization()' after 'UseRouting()', but before 'UseEndpoints()'
        /// </remarks>
        /// <param name="builder"></param>
        /// <param name="configRoot"></param>
        public static AuthenticationBuilder AddGoogleOAuth(
            this AuthenticationBuilder builder,
            IConfigurationRoot configRoot
        )
        {
            var config = GetOAuthConfig(configRoot, WebConfiguration.AUTHENTICATION_GOOGLE);
            if (config.IsDisabled)
            {
                return builder;
            }

            return builder.AddGoogle(options =>
            {
                options.ClientId = config.ClientId;
                options.ClientSecret = config.ClientSecret;
                options.Events.OnCreatingTicket = HandleCreatingTicket<GoogleUser>;
            });
        }

        /// <summary>
        /// Configure Microsoft Accounts OpenID Authentication if it is enabled
        /// </summary>
        /// <remarks>
        /// Remember to configure 'UseAuthorization()' after 'UseRouting()', but before 'UseEndpoints()'
        /// </remarks>
        /// <param name="builder"></param>
        /// <param name="configRoot"></param>
        public static AuthenticationBuilder AddMicrosoftOAuth(
            this AuthenticationBuilder builder,
            IConfigurationRoot configRoot
        )
        {
            var config = GetOAuthConfig(configRoot, WebConfiguration.AUTHENTICATION_MICROSOFT);
            if (config.IsDisabled)
            {
                return builder;
            }

            return builder.AddMicrosoftAccount(options =>
            {
                options.ClientId = config.ClientId;
                options.ClientSecret = config.ClientSecret;
                options.Events.OnCreatingTicket = HandleCreatingTicket<MicrosoftUser>;
            });
        }

        #endregion Public Methods

        #region Private Methods

        private static IEnumerable<Claim> GetClaims(User user, UserLogin userLogin) =>
            AuthenticationUtils.GetClaims(user, userLogin);

        private static OAuthAccountConfiguration GetOAuthConfig(IConfigurationRoot configRoot, string configSection)
        {
            var config = configRoot
                .GetSection(WebConfiguration.AUTHENTICATION)
                .GetSection(configSection)
                .Get<OAuthAccountConfiguration>();

            if (config == null)
            {
                var configPath = $"{WebConfiguration.AUTHENTICATION}:{configSection}";
                throw new Exception($"Unable to find configuration for '{configPath}' <OAuthAuthenticationConfiguration>");
            }

            return config;
        }

        private static async Task HandleCreatingTicket<TOAuthUser>(OAuthCreatingTicketContext context)
            where TOAuthUser : class, IOAuthUser
            => await OAuthHandler<TOAuthUser, User, UserLogin, UserMetadata>.HandleCreatingTicket(context, GetClaims);

        #endregion Private Methods
    }
}
