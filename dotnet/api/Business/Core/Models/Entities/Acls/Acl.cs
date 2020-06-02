using AndcultureCode.CSharp.Core.Models;
using Core.Interfaces.Models.Entities.Acls;
using AndcultureCode.GB.Business.Core.Enumerations;

namespace AndcultureCode.GB.Business.Core.Models.Entities.Acls
{
    public class Acl : Auditable, IAcl
    {
        public Permission Permission { get; set; }
        public string Resource { get; set; }
        public string Subject { get; set; }
        public string Verb { get; set; }
    }
}