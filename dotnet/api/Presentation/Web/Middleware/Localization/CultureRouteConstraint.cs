using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using AndcultureCode.GB.Presentation.Web.Constants;
using AndcultureCode.CSharp.Core.Utilities.Localization;

namespace AndcultureCode.GB.Presentation.Web.Middleware.Localization
{
    public class CultureRouteConstraint : IRouteConstraint
    {
        public bool Match(HttpContext httpContext, IRouter route, string routeKey, RouteValueDictionary values, RouteDirection routeDirection)
        {
            if (!values.ContainsKey(Api.ROUTING_CULTURE_CONSTRAINT))
            {
                return false;
            }

            var cultureCode = values[Api.ROUTING_CULTURE_CONSTRAINT].ToString();

            return LocalizationUtils.CultureExists(cultureCode);
        }
    }
}