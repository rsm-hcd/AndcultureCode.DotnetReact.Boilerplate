using Microsoft.AspNetCore.Mvc;
using System;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.CSharp.Core.Extensions;
using System.Net;
using Newtonsoft.Json;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Errors;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using AndcultureCode.GB.Presentation.Web.Attributes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.Errors
{
    /// <summary>
    /// Api controller used to demonstrate and test error handling of the API Application
    /// </summary>
    [AllowAnonymous]
    [FormatFilter]
    [ApiRoute("errors")]
    public class ErrorsController : ApiController
    {
        #region Constants

        public const string ERROR_INTERNAL_SERVER_ERROR = "Web.ErrorsController.InternalError";

        #endregion Constants

        #region Properties

        ILogger<ErrorsController> _logger;

        #endregion Properties


        #region Constructor

        public ErrorsController(
            IStringLocalizer localizer,
            ILogger<ErrorsController> logger
        ) : base(localizer)
        {
            _logger = logger;
        }

        #endregion Constructor

        #region Public Methods

        #region Post

        /// <summary>
        /// Used to experiment with how the API globally responds to various HTTP status codes
        /// </summary>
        /// <remarks>
        ///
        ///     POST /errors
        ///     {
        ///         "status": 500
        ///     }
        ///
        /// </remarks>
        /// <param name="dto">Error descriptor for request</param>
        /// <returns></returns>
        [AclAuthorize(isSuperAdminRequired: true)]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult Post([FromBody] ErrorDto dto)
        {
            var result = new Result<ErrorDto>();

            Console.WriteLine(JsonConvert.SerializeObject(dto, Formatting.Indented));

            switch (dto.Status)
            {
                case HttpStatusCode.InternalServerError:
                    {
                        result.AddError(Localizer, ERROR_INTERNAL_SERVER_ERROR);
                        return InternalError<ErrorDto>(null, result.Errors, _logger);
                    }
            }

            return Ok();
        }

        #endregion Post

        #endregion Public Methods
    }
}
