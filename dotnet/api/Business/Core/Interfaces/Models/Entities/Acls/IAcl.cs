using AndcultureCode.CSharp.Core.Interfaces.Entity;
using AndcultureCode.GB.Business.Core.Enumerations;

namespace Core.Interfaces.Models.Entities.Acls
{
    public interface IAcl : IAuditable
    {
        Permission Permission { get; set; }
        string Resource { get; set; }
        string Subject { get; set; }
        string Verb { get; set; }

    }
}