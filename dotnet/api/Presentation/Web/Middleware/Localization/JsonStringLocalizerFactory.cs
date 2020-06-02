using System;
using Microsoft.Extensions.Localization;

namespace AndcultureCode.GB.Presentation.Web.Middleware.Localization
{
    public class JsonStringLocalizerFactory : IStringLocalizerFactory
    {
        #region Public Methods

        public IStringLocalizer Create(Type resourceSource) => new JsonStringLocalizer();
        public IStringLocalizer Create(string baseName, string location) => new JsonStringLocalizer();

        #endregion Public Methods
    }
}
