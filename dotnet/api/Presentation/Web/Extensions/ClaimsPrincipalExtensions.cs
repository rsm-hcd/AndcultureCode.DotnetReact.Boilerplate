using System;
using System.Linq;
using System.Security.Claims;
using AndcultureCode.CSharp.Extensions;
using AndcultureCode.GB.Presentation.Web.Constants;

namespace AndcultureCode.GB.Presentation.Web.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Retrieves user's UserLoginId from identity claims.
        /// TODO: Abstract to AndcultureCode.CSharp.Extensions
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public static long? UserLoginId(this ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }

            if (principal.IsUnauthenticated())
            {
                return null;
            }

            var userLoginIdClaim = principal.Claims?.FirstOrDefault(c => c.Type == ApiClaimTypes.USER_LOGIN_ID);
            if (userLoginIdClaim == null || string.IsNullOrWhiteSpace(userLoginIdClaim.Value))
            {
                return null;
            }

            return Convert.ToInt64(userLoginIdClaim.Value);
        }
    }
}