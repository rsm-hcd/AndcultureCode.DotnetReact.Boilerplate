using System;
using AndcultureCode.CSharp.Core.Interfaces.Entity;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;

namespace AndcultureCode.GB.Business.Core.Models.Entities.Users
{
    public class UserLogin : Auditable, IUserLogin
    {
        #region Properties

        public int FailedAttemptCount { get; set; }
        public string Ip { get; set; }
        public bool IsSuccessful { get; set; }
        public DateTimeOffset? KeepAliveOn { get; set; }
        public long? RoleId { get; set; }
        public string ServerName { get; set; }
        public string UserAgent { get; set; }
        public long? UserId { get; set; }
        public string UserName { get; set; }

        #endregion Properties

        #region Navigation Properties

        public virtual Role Role { get; set; }
        public virtual User User { get; set; }

        #endregion Navigation Properties

        #region IUserLogin Implementation

        IRole IUserLogin.Role { get => Role; }
        IUser IUserLogin.User { get => User; }

        #endregion IUserLogin Implementation
    }
}
