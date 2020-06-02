using System;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;

namespace AndcultureCode.GB.Business.Core.Models.Entities.Users
{
    public class UserRole : Auditable
    {
        #region Properties

        public long RoleId { get; set; }
        public long UserId { get; set; }

        #endregion Properties


        #region Navigation Properties

        public Role Role { get; set; }
        public User User { get; set; }

        #endregion Navigation Properties
    }
}