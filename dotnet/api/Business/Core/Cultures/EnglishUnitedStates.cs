
using AndcultureCode.GB.Business.Core.Constants.Localization;
using AndcultureCode.GB.Business.Core.Models.Localization;

namespace AndcultureCode.GB.Business.Core.Cultures
{
    public class EnglishUnitedStates : Culture
    {
        public override string Code { get => Iso639LanguageCodes.EN_US; }
        public override bool IsDefault => true;
    }
}
