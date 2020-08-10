using Microsoft.Extensions.Localization;

// -------------------------------------------------------------------------------------------------
// Please be open-source minded first, adding only business specific overrides to this base.
// Do your best to abstract any common logic into AndcultureCode packages.
//
// If time doesn't permit to abstract it, please create a new github issue
// https://github.com/AndcultureCode/AndcultureCode.CSharp.Web/issues/new
// and add the issue URL in a comment for later abstraction.
// -------------------------------------------------------------------------------------------------

namespace AndcultureCode.GB.Presentation.Web.Controllers.Api.V1
{
    /// <summary>
    /// Application API controller for sharing logic between controllers
    /// </summary>
    public class ApiController : AndcultureCode.CSharp.Web.Controllers.ApiController<ApiClaimsPrincipal>
    {
        #region Constructors

        /// <summary>
        /// Localized controller constructor
        /// </summary>
        /// <param name="localizer"></param>
        /// <returns></returns>
        public ApiController(IStringLocalizer localizer) : base(localizer) { }

        #endregion Constructors
    }
}
