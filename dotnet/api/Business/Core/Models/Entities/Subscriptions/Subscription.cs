using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.GB.Business.Core.Enumerations.Subscriptions;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;

namespace AndcultureCode.GB.Business.Core.Models.Entities.Subscriptions
{
    public class Subscription : Auditable
    {
        #region Properties

        public string Description { get; set; }
        public string Name { get; set; }
        public string ExternalProductId { get; set; }
        public long RoleId { get; set; }
        public RoleType RoleType { get; set; }
        public string Sku { get; set; }

        #endregion Properties

        #region Navigation Properties

        public Role Role { get; set; }

        #endregion Navigation Properties
    }
}
