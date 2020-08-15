using AndcultureCode.CSharp.Testing.Factories;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;

namespace AndcultureCode.GB.Testing.Factories.Models.Entities.Users
{
    public class UserFactory : Factory
    {
        #region Constants

        public const string SUPER_ADMIN = "SUPER_ADMIN";

        #endregion Constants

        #region Factories

        public override void Define()
        {
            this.DefineFactory(() => GetDefaultUser());

            this.DefineFactory<User>(SUPER_ADMIN, () => GetDefaultUser(user =>
            {
                user.IsSuperAdmin = true;
            }));
        }

        #endregion Factories

        #region Private Methods

        private User GetDefaultUser(GetDefaultUserCallback callback = null)
        {
            var user = new User
            {
                Email = $"testuser{UniqueNumber}@example.com",
                UserName = $"TestUserName{UniqueNumber}"
            };

            if (callback != null)
            {
                callback(user);
            }

            return user;
        }

        private delegate void GetDefaultUserCallback(User user);

        #endregion Private Methods
    }
}
