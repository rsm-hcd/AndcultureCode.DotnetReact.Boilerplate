using System.Linq;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Business.Core.Models.Jobs;
using AndcultureCode.CSharp.Core.Models.Entities;

namespace AndcultureCode.GB.Business.Core.Interfaces.Data
{
    /// <summary>
    /// TODO: Inherit AndcultureCode.CSharp.Core.Interfaces.Data.IApplicationContext
    /// </summary>
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
