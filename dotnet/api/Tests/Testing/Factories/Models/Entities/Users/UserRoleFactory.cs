using AndcultureCode.CSharp.Testing.Factories;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;

namespace AndcultureCode.GB.Testing.Factories.Models.Entities.Users
{
    public class UserRoleFactory : Factory
    {
        public override void Define()
        {
            this.DefineFactory(() => new UserRole
            {
                RoleId = long.MaxValue,
                UserId = long.MaxValue
            });
        }
    }
}