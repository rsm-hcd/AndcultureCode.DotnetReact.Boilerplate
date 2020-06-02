using AndcultureCode.GB.Business.Core.Enumerations;

namespace AndcultureCode.GB.Business.Core.Models.Security
{
    public class Deny : AccessRule
    {
        public override Permission Permission => Permission.Deny;

        #region Constructor

        public Deny(string resource,
            string verb,
            string subject)
            : base(resource, verb, subject)
        {
        }

        #endregion
    }
}
