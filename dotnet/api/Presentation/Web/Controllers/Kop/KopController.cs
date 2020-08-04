using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using AndcultureController = AndcultureCode.CSharp.Web.Controllers.Controller;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Kop
{
    public class KopController : AndcultureController
    {
        public KopController(IStringLocalizer localizer) : base(localizer) { }

        /// <summary>
        /// Our deployments of the KOP artifacts output to `wwwroot/kop`.
        /// This redirection saves the need to identify the file in the route.
        /// </summary>
        [AllowAnonymous]
        public IActionResult Index() => Redirect("/kop/index.html");
    }
}
