using AndcultureCode.CSharp.Core.Enumerations;
using AndcultureCode.CSharp.Core.Models.Entities;
using AndcultureCode.CSharp.Testing.Factories;

namespace AndcultureCode.GB.Testing.Factories.Models.Entities.Acls
{
    public class AclFactory : Factory
    {
        #region Named Factories

        public static string DENY = "Deny";

        #endregion Named Factories

        public override void Define()
        {
            this.DefineFactory(() => new Acl
            {
                Permission = Permission.Allow,
                Resource = "Test.Object",
                Subject = "*",
                Verb = "Read"
            });

            this.DefineFactory(DENY, () => new Acl
            {
                Permission = Permission.Deny,
                Resource = "Test.Object",
                Subject = "*",
                Verb = "Read"
            });
        }
    }
}
