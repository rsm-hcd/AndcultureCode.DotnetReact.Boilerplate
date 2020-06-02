using AndcultureCode.GB.Business.Core.Enumerations;

namespace AndcultureCode.GB.Business.Core.Models.Security
{
    public class Allow : AccessRule
    {
        public override Permission Permission => Permission.Allow;

        #region Constructor

        public Allow(string resource,
            string verb,
            string subject)
            : base(resource, verb, subject)
        {
        }

        #endregion Constructor
    }
}
