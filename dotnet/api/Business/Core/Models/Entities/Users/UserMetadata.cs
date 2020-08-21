using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.CSharp.Core.Interfaces.Entity;

namespace AndcultureCode.GB.Business.Core.Models.Entities.Users
{
    public class UserMetadata : Auditable, IUserMetadata
    {
        #region Properties

        public bool IsNameEditable { get; set; }
        public string Name { get; set; }
        public long? RoleId { get; set; }
        public string Type { get; set; }
        public long UserId { get; set; }
        public string Value { get; set; }

        #endregion Properties

        #region Navigation Properties

        public Role Role { get; set; }
        public User User { get; set; }

        #endregion Navigation Properties

        #region IUserMetadata Implementation

        IRole IUserMetadata.Role { get => Role; }
        IUser IUserMetadata.User { get => User; }

        #endregion IUserMetadata Implementation
    }
}
