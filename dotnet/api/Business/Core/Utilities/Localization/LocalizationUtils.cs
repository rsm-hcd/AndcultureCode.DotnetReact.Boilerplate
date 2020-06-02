using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using AndcultureCode.GB.Business.Core.Extensions;
using AndcultureCode.GB.Business.Core.Interfaces.Localization;

namespace AndcultureCode.GB.Business.Core.Utilities.Localization
{
    public static class LocalizationUtils
    {
        #region Private Properties

        private static List<ICulture> _cultures;

        #endregion Private Properties

        #region Public Properties

        /// <summary>
        /// Current cultures supported by the application
        /// </summary>
        public static List<ICulture> Cultures
        {
            get
            {
                if (_cultures != null)
                {
                    return _cultures;
                }

                _cultures = AppDomain
                    .CurrentDomain
                    .GetAssemblies()
                    .SelectMany(x => x.GetTypes())
                    .Where(x => typeof(ICulture).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract)
                    .Select(e => Activator.CreateInstance(e))
                    .Cast<ICulture>()
                    .ToList();

                return _cultures;
            }
        }

        public static List<CultureInfo> CultureInfos { get => Cultures?.ToCultureInfos(); }

        public static ICulture DefaultCulture { get => Cultures?.Default(); }

        public static string DefaultCultureCode { get => DefaultCulture?.Code; }

        public static CultureInfo DefaultCultureInfo { get => DefaultCulture?.ToCultureInfo(); }

        #endregion Public Properties


        #region Public Methods

        public static ICulture CultureByCode(string cultureCode)
            => Cultures.FirstOrDefault(e => e.Code.ToLower() == cultureCode.ToLower());

        public static string CultureCodes(string delimiter = ", ")
            => Cultures.ToCultureCodes(delimiter);

        public static bool CultureExists(string cultureCode) => Cultures.Exists(cultureCode);

        #endregion Public Methods
    }
}
