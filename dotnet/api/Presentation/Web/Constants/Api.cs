using AndcultureCode.GB.Business.Core.Constants;

namespace AndcultureCode.GB.Presentation.Web.Constants
{
    public static class Api
    {
        public const string DOCUMENTATION_RELATIVE_URL = "api/docs";

        /// <summary>
        /// API prefix routing component including version number and localization routing constraint
        /// </summary>
        public static string LOCALIZED_RELATIVE_URL_TEMPLATE { get => $"{ROUTING_CULTURE_CONSTRAINT_TEMPLATE}/{RELATIVE_URL}"; }

        /// <summary>
        /// API prefix routing component including version number
        /// </summary>
        public static string RELATIVE_URL { get => $"{VERSION_PREFIX}{VERSION}/"; }

        public const string ROUTING_CULTURE_CONSTRAINT = "culture";

        /// <summary>
        /// Localization routing constraint for use in routing template strings
        /// </summary>
        /// <value></value>
        public const string ROUTING_CULTURE_CONSTRAINT_TEMPLATE = "{culture:culture}";

        public static string TITLE = $"{AppConstants.NAME} API";

        /// <summary>
        /// Version number component of API route
        /// </summary>
        public const string VERSION = "1";

        /// <summary>
        /// Static prefix of API routes
        /// </summary>
        public const string VERSION_PREFIX = "api/v";
    }
}
