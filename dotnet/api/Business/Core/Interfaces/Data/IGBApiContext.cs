using System.Linq;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Business.Core.Models.Jobs;
using AndcultureCode.GB.Business.Core.Models.Entities.Acls;

namespace AndcultureCode.GB.Business.Core.Interfaces.Data
{
    public interface IGBApiContext
    {
        IQueryable<Acl> Acls { get; }
        IQueryable<Job> Jobs { get; }
        IQueryable<Role> Roles { get; }
        IQueryable<User> Users { get; }
        IQueryable<UserLogin> UserLogins { get; }
        IQueryable<UserRole> UserRoles { get; }
    }
}
