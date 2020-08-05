using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Localization;
using AndcultureCode.GB.Presentation.Web.Attributes;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.SystemSettings;
using AndcultureCode.CSharp.Extensions;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.SystemSettings
{
    [FormatFilter]
    [NoCache]
    [ApiRoute("systemsettings")]
    public class SystemSettingsController : ApiController
    {
        #region Private Properties

        private readonly IConfigurationRoot _configurationRoot;
        private readonly IHostEnvironment _hostingEnvironment;
        private readonly ILogger<SystemSettingsController> _logger;
        private readonly IMapper _mapper;

        #endregion Private Properties

        #region Constructors

        public SystemSettingsController(
            IConfigurationRoot configurationRoot,
            IHostEnvironment hostingEnvironment,
            IStringLocalizer localizer,
            ILogger<SystemSettingsController> logger,
            IMapper mapper
        ) : base(localizer)
        {
            _configurationRoot = configurationRoot;
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
            _mapper = mapper;
        }

        #endregion Constructors

        #region Public Methods

        #region GET

        /// <summary>
        /// Retrieves common system settings for the current user (unauthenticated or not)
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(SystemSettingsDto))]
        public IActionResult Index()
        {
            var systemSettingsDto = new SystemSettingsDto();

            // General system settings (not persisted)
            systemSettingsDto.EnvironmentName = _hostingEnvironment.EnvironmentName;
            systemSettingsDto.MachineName = System.Environment.MachineName;

            // Environment specific settings
            if (!_hostingEnvironment.IsProduction())
            {
                systemSettingsDto.DatabaseName = _configurationRoot.GetDatabaseName();
            }

            return Ok(systemSettingsDto, null);
        }

        #endregion GET

        #endregion Public Methods
    }
}
