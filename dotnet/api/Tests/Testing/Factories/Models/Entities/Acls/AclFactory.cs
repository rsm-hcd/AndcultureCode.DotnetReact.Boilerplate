using AndcultureCode.CSharp.Testing.Factories;
using AndcultureCode.GB.Business.Core.Enumerations;
using AndcultureCode.GB.Business.Core.Models.Entities.Acls;

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
                Resource = "Test.Object",
                Verb = "Read",
                Subject = "*",
                Permission = Permission.Allow
            });

            this.DefineFactory(DENY, () => new Acl
            {
                Resource = "Test.Object",
                Verb = "Read",
                Subject = "*",
                Permission = Permission.Deny
            });
        }
    }
}
