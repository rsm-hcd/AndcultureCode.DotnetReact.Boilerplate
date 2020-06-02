using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using AndcultureCode.GB.Business.Core.Enumerations;
using AndcultureCode.GB.Business.Core.Models.Security;

namespace AndcultureCode.GB.Presentation.Web.Requirements
{
    public class AclAuthorizationRequirement : IAuthorizationRequirement
    {
        public bool IsSuperAdminRequired { get; }
        public BitwiseOperator Operator { get; }
        public IEnumerable<ResourceVerb> RequiredPermissions { get; }

        public AclAuthorizationRequirement(
            BitwiseOperator op,
            IEnumerable<ResourceVerb> requiredPermissions,
            bool isSuperAdminRequired = false)
        {
            IsSuperAdminRequired = isSuperAdminRequired;
            Operator = op;
            RequiredPermissions = requiredPermissions;
        }
    }
}