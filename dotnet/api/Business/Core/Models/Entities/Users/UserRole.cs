using System;
using AndcultureCode.CSharp.Core.Interfaces.Entity;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;

namespace AndcultureCode.GB.Business.Core.Models.Entities.Users
{
    public class UserRole : Auditable, IUserRole
    {
        #region Properties

        public long RoleId { get; set; }
        public long UserId { get; set; }

        #endregion Properties


        #region Navigation Properties

        public Role Role { get; set; }
        public User User { get; set; }

        IRole IUserRole.Role { get => Role; }
        IUser IUserRole.User { get => User; }

        #endregion Navigation Properties
    }
}
