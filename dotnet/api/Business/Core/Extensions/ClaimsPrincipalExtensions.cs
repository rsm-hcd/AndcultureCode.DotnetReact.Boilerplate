using System;
using System.Linq;
using System.Security.Claims;
using AndcultureCode.GB.Business.Core.Constants.Authentication;
using AndcultureCode.GB.Business.Core.Constants.Roles;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Whether the current user is authenticated
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public static bool IsAuthenticated(this ClaimsPrincipal principal) => principal.Identity.IsAuthenticated;

        /// <summary>
        /// Whether the current user is unauthenticated
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public static bool IsUnauthenticated(this ClaimsPrincipal principal) => !principal.IsAuthenticated();

        /// <summary>
        /// Retrieves user's current role id by way of their identity claims
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public static long? RoleId(this ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }

            if (principal.IsUnauthenticated())
            {
                return null;
            }

            var roleIdClaim = principal.Claims?.FirstOrDefault(c => c.Type == GBApiClaimTypes.ROLE_IDS);
            if (roleIdClaim == null)
            {
                return null;
            }

            return Convert.ToInt64(roleIdClaim.Value);
        }

        /// <summary>
        /// Retrieves user's role ids by way of their identity claims
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public static string[] RoleIds(this ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }

            if (principal.IsUnauthenticated())
            {
                return new string[0];
            }

            return (principal.Claims?.FirstOrDefault(c => c.Type == GBApiClaimTypes.ROLE_IDS)?.Value ?? "").Split(',');
        }

        /// <summary>
        /// Retrieves user's id by way of identity claims
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public static long? UserId(this ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }

            if (principal.IsUnauthenticated())
            {
                return null;
            }

            var userIdClaim = principal.Claims?.FirstOrDefault(c => c.Type == GBApiClaimTypes.USER_ID);
            if (userIdClaim == null)
            {
                return null;
            }

            return Convert.ToInt64(userIdClaim.Value);
        }

        /// <summary>
        /// Retrieves whether the user is a super admin by way of their identity claims
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public static bool IsSuperAdmin(this ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }

            if (principal.IsUnauthenticated())
            {
                return false;
            }

            return principal.HasClaim(GBApiClaimTypes.IS_SUPER_ADMIN, "true");
        }
    }
}