using System.Collections.Generic;
using System.Linq;
using AndcultureCode.CSharp.Core;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Interfaces.Data;
using AndcultureCode.CSharp.Extensions;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors;
using AndcultureCode.GB.Business.Core.Models.Security;
using AndcultureCode.CSharp.Core.Models.Security;
using AndcultureCode.CSharp.Core.Enumerations;
using AndcultureCode.CSharp.Core.Models.Entities;
using AndcultureCode.CSharp.Core.Models.Collections;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;

namespace AndcultureCode.GB.Business.Conductors.Aspects
{
    public class PermissionConductor : IPermissionConductor
    {
        #region Constants

        public const string RESOURCE_NULL_ARGUMENT_EXCEPTION_KEY = "resource.nullargumentexception";
        public const string RESOURCE_NULL_ARGUMENT_EXCEPTION_MESSAGE = "resource cannot be null or empty";
        public const string VERB_NULL_ARGUMENT_EXCEPTION_KEY = "verb.nullargumentexception";
        public const string VERB_NULL_ARGUMENT_EXCEPTION_MESSAGE = "verb cannot be null or empty";

        #endregion Constants

        #region Properties

        private readonly IRepository<Acl> _aclRepository;
        private readonly ILogger<PermissionConductor> _logger;

        #endregion Properties

        #region Constructor

        public PermissionConductor(
            IRepository<Acl> aclRepository,
            ILogger<PermissionConductor> logger
            )
        {
            _aclRepository = aclRepository;
            _logger = logger;
        }

        #endregion Constructor

        #region Public Methods

        public IResult<List<AccessRule>> GetAcls(string resource, string verb) => Do<List<AccessRule>>.Try((r) =>
        {
            var acls = new List<AccessRule>();
            // TODO: implement caching

            if (!ValidateParameters(r, resource, verb))
            {
                return acls;
            }

            /*
            ------------------------------------------------------------------------------------------
             This was refactored to remove the ToLower() function calls for e.Resource and e.Verb.  This
             was generating Lower() SQL functions which were causing full table scans and creating a
             SQL bottleneck. This is likely a good candidate for whatever distributing caching mechanism
             we plan on implementing at a later point.
            ------------------------------------------------------------------------------------------
            */

            // Load the acl rules from the db
            var ruleQuery = _aclRepository.FindAll(
                e => e.Resource == resource &&
                e.Verb == verb &&
                e.DeletedOn == null);

            if (ruleQuery.HasErrors)
            {
                r.AddErrors(ruleQuery.Errors);
                return acls;
            }

            // Set up rules based on permission type
            foreach (var rule in ruleQuery.ResultObject.ToList())
            {
                if (rule.Permission == Permission.Allow)
                {
                    acls.Add(new Allow(rule.Resource, rule.Verb, rule.Subject));
                    continue;
                }

                acls.Add(new Deny(rule.Resource, rule.Verb, rule.Subject));

            }

            return acls;
        })
        .Result;

        public IResult<bool> IsAllowed(string resource, string verb, string subject) => Do<bool>.Try((r) =>
        {
            var acls = new OrderedList<string, AccessRule>(new ReverseComparer<string>());

            var rules = GetAcls(resource, verb);
            if (rules.HasErrors)
            {
                r.AddErrors(rules.Errors);
                return false;
            }

            // Add rules to the ordered list
            foreach (var rule in rules.ResultObject)
            {
                acls.Add(rule.Resource, rule);

                // While looping through the rules, if we find any of our specific subjects have an 'Allow' for this resource/verb pair, they are allowed!
                if (rule.Resource == resource &&
                    rule.Verb == verb &&
                    rule.Subject == subject &&
                    rule.Permission == Permission.Allow)
                {
                    return true;
                }
            }

            var aclPermission = Permission.Deny;
            bool isExplicit = false;
            bool isFirst = true;
            bool isSet = false;
            string mostAppropriateResourcePath = resource;

            foreach (var acl in acls)
            {
                if (isFirst)
                {
                    mostAppropriateResourcePath = acl.Resource;
                    isFirst = false;
                }

                if (isSet && mostAppropriateResourcePath != acl.Resource)
                {
                    return aclPermission == Permission.Allow;
                }

                if (acl.Subject == "*")
                {
                    isSet = true;
                    aclPermission = acl.Permission;
                }

                if (acl.Subject == subject)
                {
                    isSet = true;
                    isExplicit = true;
                    aclPermission = acl.Permission;
                }

                if (isExplicit)
                {
                    return aclPermission == Permission.Allow;
                }
            }

            return aclPermission == Permission.Allow;
        })
        .Result;

        public IResult<bool> IsAllowed(LogicalOperator op, IEnumerable<ResourceVerb> resourceVerbs, string subject) => Do<bool>.Try((r) =>
        {
            bool isAllowed = false;

            if (resourceVerbs.IsNullOrEmpty())
            {
                return isAllowed;
            }

            foreach (var rv in resourceVerbs)
            {
                var allowed = IsAllowed(rv.Resource, rv.Verb, subject);

                if (allowed.HasErrors)
                {
                    isAllowed = false;
                    r.AddErrors(allowed.Errors);
                    return isAllowed;
                }

                // If any are required (OR), immediately return true when one is allowed
                if (op == LogicalOperator.Or && allowed.ResultObject == true)
                {
                    isAllowed = true;
                    return isAllowed;
                }

                // If all are required (AND), immediately return false when one is not allowed
                if (op == LogicalOperator.And && allowed.ResultObject == false)
                {
                    isAllowed = false;
                    return isAllowed;
                }

                isAllowed = allowed.ResultObject;
            }

            return isAllowed;
        })
        .Result;

        public IResult<bool> IsAllowed(LogicalOperator op, string resourcePrefix, string subject) => Do<bool>.Try((r) =>
        {
            var resourceVerbs = AclStrings.GetAclStringsByPrefix(resourcePrefix)?.ToResourceVerbs();

            var allowed = IsAllowed(op, resourceVerbs, subject);
            if (allowed.HasErrors)
            {
                r.AddErrors(allowed.Errors);
                return false;
            }

            return allowed.ResultObject;
        })
        .Result;

        #endregion Public Methods

        #region Private Methods

        /// <summary>
        /// Helper method to perform parameter validation
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="result"></param>
        /// <param name="resource"></param>
        /// <param name="verb"></param>
        /// <returns></returns>
        bool ValidateParameters<T>(IResult<T> result, string resource, string verb)
        {
            if (string.IsNullOrWhiteSpace(resource))
            {
                result.AddError($"nullargumentexception.{nameof(resource)}", $"{nameof(resource)} cannot be null or empty");
            }

            if (string.IsNullOrWhiteSpace(verb))
            {
                result.AddError($"nullargumentexception.{nameof(verb)}", $"{nameof(verb)} cannot be null or empty");
            }

            return !result.HasErrors;
        }

        #endregion Private Methods
    }
}
