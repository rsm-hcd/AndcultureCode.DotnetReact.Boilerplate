using AndcultureCode.CSharp.Core.Enumerations;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions.Models
{
    public class SeedAclRule
    {
        public string Acl { get; set; }
        public Permission Permission { get; set; }

        public SeedAclRule(string acl, Permission permission)
        {
            Acl = acl;
            Permission = Permission;
        }
    }
}