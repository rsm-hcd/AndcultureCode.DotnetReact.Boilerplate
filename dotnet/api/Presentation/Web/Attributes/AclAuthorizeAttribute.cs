using Microsoft.AspNetCore.Mvc;
using AndcultureCode.GB.Business.Core.Extensions;
using AndcultureCode.GB.Business.Core.Models.Security;
using AndcultureCode.GB.Presentation.Web.Filters.Authorization;
using AndcultureCode.GB.Presentation.Web.Requirements;
using System;
using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Models.Security;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Enumerations;

namespace AndcultureCode.GB.Presentation.Web.Attributes
{
    public class AclAuthorizeAttribute : TypeFilterAttribute
    {
        public AclAuthorizeAttribute()
            : base(typeof(AclAuthorizationFilter)) =>
            Arguments = new[] { new AclAuthorizationRequirement(LogicalOperator.And, new List<ResourceVerb>()) };

        public AclAuthorizeAttribute(bool isSuperAdminRequired)
            : base(typeof(AclAuthorizationFilter)) =>
            Arguments = new[] { new AclAuthorizationRequirement(LogicalOperator.And, new List<ResourceVerb>(), isSuperAdminRequired) };

        public AclAuthorizeAttribute(params string[] resourceVerbs)
            : base(typeof(AclAuthorizationFilter)) =>
            Arguments = new[] { new AclAuthorizationRequirement(LogicalOperator.And, resourceVerbs.ToResourceVerbs()) };

        public AclAuthorizeAttribute(bool isSuperAdminRequired, params string[] resourceVerbs)
            : base(typeof(AclAuthorizationFilter)) =>
            Arguments = new[] { new AclAuthorizationRequirement(LogicalOperator.And, resourceVerbs.ToResourceVerbs(), isSuperAdminRequired) };

        public AclAuthorizeAttribute(LogicalOperator op, params string[] resourceVerbs)
            : base(typeof(AclAuthorizationFilter)) =>
            Arguments = new[] { new AclAuthorizationRequirement(op, resourceVerbs.ToResourceVerbs()) };

        public AclAuthorizeAttribute(bool isSuperAdminRequired, LogicalOperator op, params string[] resourceVerbs)
            : base(typeof(AclAuthorizationFilter)) =>
            Arguments = new[] { new AclAuthorizationRequirement(op, resourceVerbs.ToResourceVerbs(), isSuperAdminRequired) };

        /// <summary>
        /// Adds rule for all Acl strings starting with the provided prefix
        /// </summary>
        /// <param name="op">Logical operator for all acl strings matching prefix</param>
        /// <param name="prefix">String that acls must start with to be a match</param>
        /// <param name="isSuperAdminRequired">Requires user to have super admin role</param>
        public AclAuthorizeAttribute(LogicalOperator op, string prefix, bool isSuperAdminRequired = false)
            : base(typeof(AclAuthorizationFilter))
        {
            var resourceVerbs = AclStrings.GetAclStringsByPrefix(prefix).ToResourceVerbs();
            Arguments = new[] { new AclAuthorizationRequirement(op, resourceVerbs, isSuperAdminRequired) };
        }
    }
}