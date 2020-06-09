using System.Collections.Generic;
using System.Security.Claims;
using AndcultureCode.CSharp.Extensions;
using Microsoft.AspNetCore.Authentication;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.CSharp.Core.Constants;

namespace AndcultureCode.GB.Presentation.Web.Middleware.Authentication
{
    public static class AuthenticationUtils
    {
        #region Constants

        public const string AUTHENTICATION_SCHEME = "GB";

        #endregion Constants

        #region Public Methods

        public static AuthenticationProperties GetAuthenticationProperties() => new AuthenticationProperties
        {
            AllowRefresh = false,
            IsPersistent = true
        };

        public static List<Claim> GetClaims(User user, IEnumerable<long> roleIds = null)
        {
            var claims = new List<Claim>
            {
                new Claim(ApiClaimTypes.USER_ID,  user.Id.ToString(), ClaimValueTypes.Integer64),
                new Claim(ApiClaimTypes.IS_SUPER_ADMIN, user.IsSuperAdmin.ToString().ToLower(), ClaimValueTypes.Boolean),
            };

            if (!roleIds.IsNullOrEmpty())
            {
                claims.Add(new Claim(ApiClaimTypes.ROLE_IDS, string.Join(",", roleIds), ClaimValueTypes.Integer64));
            }

            return claims;
        }

        #endregion Public Methods
    }
}