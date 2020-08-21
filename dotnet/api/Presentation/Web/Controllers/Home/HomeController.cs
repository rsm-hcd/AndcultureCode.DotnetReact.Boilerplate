using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Localization;
using AndcultureCode.GB.Presentation.Web.Attributes;
using AndcultureCode.CSharp.Core.Constants;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Home
{
    public class HomeController : AndcultureCode.CSharp.Web.Controllers.Controller
    {
        #region Properties

        private IHostEnvironment _env { get; set; }
        private string _filePath = Startup.FRONTEND_STATIC_CONTENT_PATH + "/index.html";

        #endregion Properties

        #region Constructors

        public HomeController(
            IStringLocalizer localizer,
            IHostEnvironment env
        ) : base(localizer)
        {
            _env = env;
        }

        #endregion Constructors

        #region GET

        /// <summary>
        /// Our deployments of the application artifacts output to `wwwroot/`.
        /// </summary>
        [AllowAnonymous] // Must be configured or 'AuthorizeFilter' is executed
        [BasicAuth]
        public IActionResult Index()
        {
            var file = _env.ContentRootFileProvider.GetFileInfo(_filePath);
            return PhysicalFile(file.PhysicalPath, ContentTypes.HTML);
        }

        #endregion GET
    }
}
