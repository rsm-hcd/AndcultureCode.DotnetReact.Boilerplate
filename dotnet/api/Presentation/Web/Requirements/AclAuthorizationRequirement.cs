using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using AndcultureCode.CSharp.Core.Models.Security;
using AndcultureCode.CSharp.Core.Enumerations;

namespace AndcultureCode.GB.Presentation.Web.Requirements
{
    public class AclAuthorizationRequirement : IAuthorizationRequirement
    {
        #region Properties

        public bool IsSuperAdminRequired { get; }
        public LogicalOperator Operator { get; }
        public IEnumerable<ResourceVerb> RequiredPermissions { get; }

        #endregion Properties

        #region Constructor

        public AclAuthorizationRequirement(
            LogicalOperator op,
            IEnumerable<ResourceVerb> requiredPermissions,
            bool isSuperAdminRequired = false)
        {
            IsSuperAdminRequired = isSuperAdminRequired;
            Operator = op;
            RequiredPermissions = requiredPermissions;
        }

        #endregion Constructor
    }
}