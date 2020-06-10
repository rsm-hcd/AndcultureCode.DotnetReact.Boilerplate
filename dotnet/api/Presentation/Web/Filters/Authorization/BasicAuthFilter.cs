using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Net.Http.Headers;
using System.Net;
using System.Text;
using AndcultureCode.GB.Business.Core.Models.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Presentation.Web.Extensions;
using AndcultureCode.CSharp.Core.Models.Configuration;

namespace AndcultureCode.GB.Presentation.Web.Filters.Authorization
{
    /// <summary>
    /// TODO: Extract to AndcultureCode.CSharp.Web
    /// </summary>
    public class BasicAuthFilter : IAuthorizationFilter
    {
        #region Constants

        private const string ERROR_GENERAL = "Failed to authorize request";
        private const string ERROR_REALM_REQUIRED = "Please provide a non-empty realm value";

        #endregion Constants

        #region Properties

        private readonly string _realm;

        #endregion Properties

        #region Constructors

        public BasicAuthFilter(string realm)
        {
            if (string.IsNullOrWhiteSpace(realm))
            {
                throw new ArgumentNullException(nameof(realm), ERROR_REALM_REQUIRED);
            }

            _realm = realm;
        }

        #endregion Constructors

        #region Public Methods

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                var config = context.GetService<BasicAuthenticationConfiguration>();
                if (IsDisabled(config))
                {
                    return;
                }

                var header = GetHeader(context);
                if (header == null)
                {
                    ReturnUnauthorizedResult(context);
                    return;
                }

                if (IsAuthorized(config, header))
                {
                    return;
                }
            }
            catch (Exception ex)
            {
                context.GetService<ILogger<BasicAuthFilter>>().LogError(ex, ERROR_GENERAL);
            }

            ReturnUnauthorizedResult(context);
        }

        #endregion Public Methods

        #region Private Methods

        private string[] GetCredentials(AuthenticationHeaderValue authHeader) =>
            Encoding.UTF8
                .GetString(Convert.FromBase64String(authHeader.Parameter ?? string.Empty))
                .Split(':', 2);

        private AuthenticationHeaderValue GetHeader(AuthorizationFilterContext context)
        {
            string headerInput = context.HttpContext.Request.Headers["Authorization"];
            if (headerInput == null)
            {
                return null;
            }

            var header = AuthenticationHeaderValue.Parse(headerInput);
            if (!header.Scheme.Equals(AuthenticationSchemes.Basic.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            return header;
        }

        private bool IsAuthorized(BasicAuthenticationConfiguration config, AuthenticationHeaderValue header)
        {
            var credentials = GetCredentials(header);
            if (credentials.Length != 2)
            {
                return false;
            }

            var userName = credentials[0];
            var password = credentials[1];

            return config.UserName == userName && config.Password == password;
        }

        private bool IsDisabled(BasicAuthenticationConfiguration config)
            => config == null || !config.IsEnabled;

        private void ReturnUnauthorizedResult(AuthorizationFilterContext context)
        {
            // Return 401 and a basic authentication challenge (causes browser to show login dialog)
            context.HttpContext.Response.Headers["WWW-Authenticate"] = $"Basic realm=\"{_realm}\"";
            context.Result = new UnauthorizedResult();
        }

        #endregion Private Methods
    }
}
