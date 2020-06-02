using AndcultureCode.GB.Business.Core.Interfaces.Localization;
using AndcultureCode.GB.Business.Core.Models.Localization;

namespace AndcultureCode.GB.Business.Core.Tests.Unit.Stubs
{
    public class CultureStub : Culture, ICulture
    {
        public override string Code => "te-ST";
    }
}
