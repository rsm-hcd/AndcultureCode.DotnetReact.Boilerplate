using System;
using AndcultureCode.GB.Business.Core.Enumerations;

namespace AndcultureCode.GB.Business.Core.Models.Security
{
    public abstract class AccessRule : IEquatable<AccessRule>
    {

        public string Resource { get; set; }
        public string Verb { get; set; }
        public string Subject { get; set; }

        public abstract Permission Permission { get; }

        #region Constructor

        protected AccessRule(string resource,
            string verb,
            string subject)
        {
            Resource = resource;
            Verb = verb;
            Subject = subject;
        }

        #endregion Constructor


        #region IEquatable<AccessRule> Implementation

        bool IEquatable<AccessRule>.Equals(AccessRule other)
        {
            return other.Resource == Resource
                && other.Verb == Verb
                && other.Subject == Subject
                && other.Permission == Permission;
        }

        #endregion IEquatable<AccessRule> Implementation
    }
}
