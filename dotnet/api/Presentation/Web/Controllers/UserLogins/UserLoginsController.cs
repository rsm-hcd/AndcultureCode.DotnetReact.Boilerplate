using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Localization;
using AndcultureCode.GB.Presentation.Web.Attributes;
using AndcultureCode.CSharp.Core.Constants;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;

namespace AndcultureCode.GB.Presentation.Web.Controllers.UserLogins
{
    [Route("userlogins")]
    public class UserLoginsController : AndcultureCode.CSharp.Web.Controllers.Controller
    {
        #region Constructors

        public UserLoginsController(
            IStringLocalizer localizer
        ) : base(localizer)
        {
        }

        #endregion Constructors

        #region GET

        /// <summary>
        /// Our deployments of the application artifacts output to `wwwroot/`.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("challenge")]
        public IActionResult Challenge(string returnUrl = "/", string scheme = MicrosoftAccountDefaults.AuthenticationScheme)
            => Challenge(new AuthenticationProperties { RedirectUri = returnUrl }, scheme);

        #endregion GET
    }
}
