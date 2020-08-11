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
        public const string AUTHENTICATION_TYPE = "api";

        #endregion Constants

        #region Public Methods

        public static AuthenticationProperties GetAuthenticationProperties() => new AuthenticationProperties
        {
            AllowRefresh = false,
            IsPersistent = true
        };

        public static List<Claim> GetClaims(
            User user,
            UserLogin userLogin,
            IEnumerable<long> roleIds = null,
            int? roleType = null
        )
        {
            var isSuperAdmin = user.IsSuperAdmin;
            var roleId = userLogin.RoleId;
            var userId = userLogin.UserId;

            var claims = new List<Claim>
            {
                new Claim(ApiClaimTypes.IS_SUPER_ADMIN, isSuperAdmin.ToString().ToLower(), ClaimValueTypes.Boolean),
                new Claim(ApiClaimTypes.ROLE_ID, roleId.ToString(), ClaimValueTypes.Integer64),
                new Claim(ApiClaimTypes.USER_ID, userId.ToString(), ClaimValueTypes.Integer64),
                new Claim(ApiClaimTypes.USER_LOGIN_ID, userLogin.Id.ToString(), ClaimValueTypes.Integer64)
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
