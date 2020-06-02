using AndcultureCode.CSharp.Testing.Factories;
using AndcultureCode.GB.Business.Core.Enumerations.Subscriptions;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;

namespace AndcultureCode.GB.Testing.Factories.Models.Entities.Roles
{
    public class RoleFactory : Factory
    {
        #region Constants

        public const string FREE_TRIAL = "FreeTrial";
        public const string INDIVIDUAL = "Individual";
        public const string TEAM = "Team";

        #endregion Constants

        public override void Define()
        {
            this.DefineFactory(() => new Role
            {
                Description = $"Test Role Description {UniqueNumber}",
                Name = $"Test Role {UniqueNumber}"
            });

            this.DefineFactory(FREE_TRIAL, () => new Role
            {
                Description = $"Test Role Description {UniqueNumber}",
                Name = $"{FREE_TRIAL} Role {UniqueNumber}",
                RoleType = RoleType.FREE_TRIAL
            });

            this.DefineFactory(INDIVIDUAL, () => new Role
            {
                Description = $"Test Role Description {UniqueNumber}",
                Name = $"{INDIVIDUAL} Role {UniqueNumber}",
                RoleType = RoleType.INDIVIDUAL
            });

            this.DefineFactory(TEAM, () => new Role
            {
                Description = $"Test Role Description {UniqueNumber}",
                Name = $"{TEAM} Role {UniqueNumber}",
                RoleType = RoleType.TEAM
            });

            this.DefineFactory(TEAM, () => new Role
            {
                Description = $"Test Role Description {UniqueNumber}",
                Name = $"Test Role {UniqueNumber}",
                RoleType = RoleType.TEAM

            });
        }
    }
}