using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors;
using AndcultureCode.GB.Presentation.Web.Attributes;
using AndcultureCode.GB.Presentation.Web.Requirements;
using AndcultureCode.GB.Business.Core.Extensions;
using AndcultureCode.CSharp.Extensions;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;

namespace AndcultureCode.GB.Presentation.Web.Filters.Authorization
{
    public class AclAuthorizationFilter : IAuthorizationFilter
    {
        readonly ILogger<AclAuthorizeAttribute> _logger;
        readonly IPermissionConductor _permissionConductor;
        readonly AclAuthorizationRequirement _requirement;

        public AclAuthorizationFilter(ILogger<AclAuthorizeAttribute> logger,
                                        IPermissionConductor permissionConductor,
                                        AclAuthorizationRequirement requirement)
        {
            _logger = logger;
            _permissionConductor = permissionConductor;
            _requirement = requirement;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // If the user is not authenticated, return a 401
            if (context.HttpContext.User.IsUnauthenticated())
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // If request requires super admin, but the user isn't a super admin, the request is forbidden
            if (_requirement.IsSuperAdminRequired && !context.HttpContext.User.IsSuperAdmin())
            {
                context.Result = new ForbidResult();
                return;
            }

            // Check for simple authorization first
            // Only requires that a user is logged in
            if (_requirement.RequiredPermissions == null
                || _requirement.RequiredPermissions.Count() == 0)
            {
                return;
            }

            // Get the user's Current Roles
            var currentRoleIds = context.HttpContext.User.RoleIds();

            // If a Current Role ID was not provided to the Claims Principal, return an internal server error.
            if (currentRoleIds.IsNullOrEmpty())
            {
                context.Result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
                return;
            }

            // Default the route to locked
            var operationIsAllowed = false;

            // Loop over roles to get a positive response from the permissions
            foreach (var currentRoleId in currentRoleIds)
            {
                // Validate the current user's roles satisfy the required permissions
                var authResult = _permissionConductor.IsAllowed(
                    op: _requirement.Operator,
                    resourceVerbs: _requirement.RequiredPermissions,
                    subject: currentRoleId.ToString());

                if (authResult.HasErrors)
                {
                    // Unable to authorize due to error. Continue to next role.
                    operationIsAllowed = false;
                    break;
                }
                // Positive response. Return with access
                if (authResult.ResultObject)
                {
                    operationIsAllowed = true;
                    return;
                }
            }

            if (!operationIsAllowed)
            {
                context.Result = new ForbidResult();
                return;
            }
        }
    }
}
