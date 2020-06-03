using AndcultureCode.CSharp.Testing.Factories;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;

namespace AndcultureCode.GB.Testing.Factories.Models.Entities.Roles
{
    public class RoleFactory : Factory
    {
        public override void Define()
        {
            this.DefineFactory(() => new Role
            {
                Description = $"Test Role Description {UniqueNumber}",
                Name = $"Test Role {UniqueNumber}"
            });
        }
    }
}