using System;
using Microsoft.AspNetCore.Mvc.Routing;
using AndcultureCode.GB.Presentation.Web.Constants;

namespace AndcultureCode.GB.Presentation.Web.Attributes
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class ApiRouteAttribute : Attribute, IRouteTemplateProvider
    {
        #region Private Properties

        private readonly string _template;

        #endregion Private Properties


        #region Public Properties

        public string Name { get; set; }
        public int? Order { get; set; }
        public string Template { get => _template; }

        #endregion Public Properties


        #region Constructors

        /// <summary>
        /// Construct localized API route
        /// </summary>
        /// <param name="template">Unique routing template for this controller. Excluding the 'api/v{X}' prefix</param>
        public ApiRouteAttribute(string template)
        {
            if (template.StartsWith("/"))
            {
                template = template.Substring(1);
            }

            _template = $"{Api.LOCALIZED_RELATIVE_URL_TEMPLATE}{template}";
        }

        #endregion Constructors
    }
}