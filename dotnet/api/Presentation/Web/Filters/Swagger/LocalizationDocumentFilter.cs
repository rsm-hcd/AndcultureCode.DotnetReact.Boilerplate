using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;
using AndcultureCode.CSharp.Extensions;
using AndcultureCode.GB.Presentation.Web.Constants;
using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Utilities.Localization;

namespace AndcultureCode.GB.Presentation.Web.Filters.Swagger
{
    /// <summary>
    /// Enhances Swagger API documentation for global localization related information
    ///
    /// Iterates through each path (aka controller) and its operations (aka methods/routes)
    /// and ensures localization related parameters are documented consistently
    /// </summary>
    public class LocalizationDocumentFilter : IDocumentFilter
    {
        #region Properties

        private static string _cultureNames = LocalizationUtils.CultureCodes().ToLower();
        private static string _defaultCultureName = LocalizationUtils.DefaultCultureCode.ToLower();
        private static string _description = $"Localization culture code - (Default: {_defaultCultureName}, Options: {_cultureNames})";

        #endregion Properties


        #region Public Methods

        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            var paths = swaggerDoc.Paths.AsEnumerable();
            if (paths.IsEmpty())
            {
                return;
            }

            ApplyToControllers(paths);
        }

        #endregion Public Methods


        #region Private Methods

        /// <summary>
        /// An 'Operation' is an API Controller method (ie. get, post, etc...)
        /// </summary>
        private void ApplyToControllerMethod(KeyValuePair<OperationType, OpenApiOperation> operationItem)
        {
            var operationName = operationItem.Key; // ie. get, post, etc...
            var operation = operationItem.Value;
            var cultureParam = operation.Parameters.FirstOrDefault(e => e.Name.ToLower() == Api.ROUTING_CULTURE_CONSTRAINT);

            if (cultureParam == null)
            {
                cultureParam = new OpenApiParameter();
                operation.Parameters.Add(cultureParam);
            }

            cultureParam.Name = Api.ROUTING_CULTURE_CONSTRAINT;
            cultureParam.Description = _description;
            cultureParam.Required = false;
        }

        private void ApplyToControllerMethods(IDictionary<OperationType, OpenApiOperation> operations)
        {
            foreach (var operationItem in operations)
            {
                ApplyToControllerMethod(operationItem);
            }
        }

        private void ApplyToController(KeyValuePair<string, OpenApiPathItem> pathItem)
        {
            var route = pathItem.Key;
            if (!route.Contains($"{{{Api.ROUTING_CULTURE_CONSTRAINT}}}"))
            {
                return;
            }

            ApplyToControllerMethods(pathItem.Value.Operations);
        }

        private void ApplyToControllers(IEnumerable<KeyValuePair<string, OpenApiPathItem>> pathItems)
        {
            foreach (var pathItem in pathItems)
            {
                ApplyToController(pathItem);
            }
        }

        #endregion Private Methods
    }
}
