using AndcultureCode.CSharp.Testing.Factories;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;

namespace AndcultureCode.GB.Testing.Factories.Models.Entities.Users
{
    public class UserFactory : Factory
    {
        public override void Define()
        {
            this.DefineFactory(() => new User
            {
                Email = $"testuser{Milliseconds}@example.com",
                UserName = $"TestUserName{Milliseconds}"
            });
        }
    }
}