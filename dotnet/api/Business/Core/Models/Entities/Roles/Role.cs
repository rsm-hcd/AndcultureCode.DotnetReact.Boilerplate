using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.GB.Business.Core.Enumerations.Subscriptions;
using AndcultureCode.GB.Business.Core.Models.Entities.Subscriptions;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;

namespace AndcultureCode.GB.Business.Core.Models.Entities.Roles
{
    public class Role : Auditable
    {
        #region Properties

        public string Description { get; set; }
        public string Name { get; set; }
        public RoleType? RoleType { get; set; }

        #endregion Properties


        #region Navigation Properties

        public List<UserRole> UserRoles { get; set; }

        #endregion Navigation Properties
    }
}