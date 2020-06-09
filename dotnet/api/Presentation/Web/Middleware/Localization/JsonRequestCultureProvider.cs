using System;
using System.Threading.Tasks;
using AndcultureCode.CSharp.Core.Utilities.Localization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;

namespace AndcultureCode.GB.Presentation.Web.Middleware.Localization
{
    public class JsonRequestCultureProvider : RequestCultureProvider
    {
        #region Properties

        public int IndexOfCulture;
        public int IndexOfUiCulture;

        #endregion Properties


        #region Public Methods

        public override Task<ProviderCultureResult> DetermineProviderCultureResult(HttpContext httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException(nameof(httpContext));
            }

            var routeParts = httpContext.Request.Path.Value.Split('/');
            var culture = routeParts[IndexOfCulture]?.ToString();
            var uiCulture = routeParts[IndexOfUiCulture]?.ToString();

            if (culture == null && uiCulture == null)
            {
                culture = uiCulture = LocalizationUtils.DefaultCultureCode;
            }
            else if (culture != null && uiCulture == null)
            {
                uiCulture = culture;
            }
            else if (culture == null && uiCulture != null)
            {
                culture = uiCulture;
            }

            var providerResultCulture = new ProviderCultureResult(culture, uiCulture);

            return Task.FromResult(providerResultCulture);
        }

        #endregion Public Methods
    }
}