using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using AndcultureCode.GB.Business.Core.Enumerations;
using AndcultureCode.CSharp.Core.Models.Security;

namespace AndcultureCode.GB.Presentation.Web.Requirements
{
    public class AclAuthorizationRequirement : IAuthorizationRequirement
    {
        #region Properties

        public bool IsSuperAdminRequired { get; }
        public BitwiseOperator Operator { get; }
        public IEnumerable<ResourceVerb> RequiredPermissions { get; }

        #endregion Properties

        #region Constructor

        public AclAuthorizationRequirement(
            BitwiseOperator op,
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