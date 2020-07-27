using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AndcultureCode.CSharp.Core.Constants;
using AndcultureCode.CSharp.Core.Interfaces.Data;
using AndcultureCode.GB.Business.Core.Models.Configuration;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.DependencyInjection;

namespace AndcultureCode.GB.Web.Middleware.Authentication
{
    public static class SecurityStampValidator
    {
        #region Properties

        public static string TYPE_SECURITY_STAMP = "SecurityStamp";

        #endregion Properties

        #region Public Methods

        public static async Task ValidateAsync<TUser>(CookieValidatePrincipalContext context)
            where TUser : User
        {
            var requestServices = context.HttpContext.RequestServices;
            var configuration = requestServices.GetRequiredService<CookieAuthenticationConfiguration>();
            var userPrincipal = context.Principal;
            var userRepository = requestServices.GetRequiredService<IRepository<TUser>>();
            var securityStamp = GetClaimValue(userPrincipal, TYPE_SECURITY_STAMP);

            if (string.IsNullOrWhiteSpace(securityStamp))
            {
                await SignOut(context, configuration.AuthenticationScheme);
                return;
            }

            var userId = Convert.ToInt64(GetClaimValue(userPrincipal, ApiClaimTypes.USER_ID));
            var user = userId > 0 ? GetUser(userRepository, userId) : null;

            if (user == null || !string.Equals(user.SecurityStamp, securityStamp))
            {
                await SignOut(context, configuration.AuthenticationScheme);
            }
        }

        #endregion Public Methods

        #region Private Methods

        private static string GetClaimValue(ClaimsPrincipal principal, string type) =>
            principal.Claims
                .Where(c => c.Type == type)
                .Select(c => c.Value)
                .FirstOrDefault();

        private static TUser GetUser<TUser>(IRepository<TUser> repository, long id) where TUser : User
        {
            var result = repository.FindById(id);
            if (result.HasErrors)
            {
                return null;
            }

            return result.ResultObject;
        }

        private static async Task SignOut(CookieValidatePrincipalContext context, string authenticationScheme)
        {
            context.RejectPrincipal();
            await context.HttpContext.SignOutAsync(authenticationScheme);
        }

        #endregion Private Methods
    }
}
