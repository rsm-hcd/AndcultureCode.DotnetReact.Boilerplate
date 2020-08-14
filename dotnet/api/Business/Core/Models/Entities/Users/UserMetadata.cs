using AndcultureCode.GB.Business.Core.Enumerations;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.CSharp.Core.Models;

namespace AndcultureCode.GB.Business.Core.Models.Entities.Users
{
    public class UserMetadata : Auditable
    {
        public bool IsNameEditable { get; set; }
        public string Name { get; set; }
        public long? RoleId { get; set; }
        public UserMetadataType? Type { get; set; }
        public long UserId { get; set; }
        public string Value { get; set; }

        public Role Role { get; set; }
        public User User { get; set; }
    }
}
