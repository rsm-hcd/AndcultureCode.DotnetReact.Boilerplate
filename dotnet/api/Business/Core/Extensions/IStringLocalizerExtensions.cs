using System.Globalization;
using Microsoft.Extensions.Localization;
using AndcultureCode.GB.Business.Core.Utilities.Localization;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    public static class IStringLocalizerExtensions
    {
        /// <summary>
        /// Retrieve given translation for default configured culture
        /// </summary>
        /// <param name="localizer"></param>
        /// <param name="key"></param>
        /// <param name="arguments">The values with which to format the translated error message</param>
        /// <returns></returns>
        public static string Default(this IStringLocalizer localizer, string key, params object[] arguments)
        {
            // Cache current culture info
            var currentCultureInfo = CultureInfo.CurrentCulture;
            var currentUiCultureInfo = CultureInfo.CurrentUICulture;

            // Set to default culture info
            CultureInfo.CurrentCulture = LocalizationUtils.DefaultCultureInfo;
            CultureInfo.CurrentUICulture = LocalizationUtils.DefaultCultureInfo;

            var value = localizer[key, arguments];

            // Restore original culture info
            CultureInfo.CurrentCulture = currentCultureInfo;
            CultureInfo.CurrentUICulture = currentUiCultureInfo;

            return value;
        }
    }
}