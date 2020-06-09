using System.Collections.Generic;
using System.Globalization;
using Microsoft.Extensions.Localization;
using System.Linq;
using AndcultureCode.CSharp.Core.Utilities.Localization;

namespace AndcultureCode.GB.Presentation.Web.Middleware.Localization
{
    public class JsonStringLocalizer : IStringLocalizer
    {
        #region Public Properties

        public LocalizedString this[string name]
        {
            get
            {
                var value = GetString(name);
                return new LocalizedString(name, value ?? name, resourceNotFound: value == null);
            }
        }

        public LocalizedString this[string name, params object[] arguments]
        {
            get
            {
                var format = GetString(name);
                var value = string.Format(format ?? name, arguments);
                return new LocalizedString(name, value, resourceNotFound: format == null);
            }
        }

        #endregion Public Properties


        #region Public Methods

        public IEnumerable<LocalizedString> GetAllStrings(bool includeAncestorCultures)
            => LocalizationUtils.CultureByCode(CultureInfo.CurrentCulture.Name)
                .CultureTranslations
                .Select(r => new LocalizedString(r.Key, r.Value, true));

        public IStringLocalizer WithCulture(CultureInfo culture)
        {
            CultureInfo.DefaultThreadCurrentCulture = culture;
            return new JsonStringLocalizer();
        }

        #endregion Public Methods


        #region Private Methods

        private string GetString(string name)
            => LocalizationUtils.CultureByCode(CultureInfo.CurrentCulture.Name)
                .CultureTranslations
                .FirstOrDefault(r => r.Key == name)?.Value;

        #endregion Private Methods
    }

    public class JsonStringLocalizer<T> : JsonStringLocalizer, IStringLocalizer<T> { }
}