using System;
using System.Collections.Generic;
using System.Linq;
using AndcultureCode.CSharp.Core.Enumerations;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Business.Core.Providers.Logging;
using AndcultureCode.GB.Business.Core.Extensions;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Localization;
using AndcultureCode.CSharp.Core.Utilities.Localization;

namespace AndcultureCode.GB.Presentation.Web.Controllers
{

    public class Controller : Microsoft.AspNetCore.Mvc.Controller
    {
        #region Constants

        public const string BADREQUEST_INVALID_FK_KEY = "Web.Controller.BADREQUEST_INVALID_FK";
        public const string ERROR_DB_EXCEPTION_KEY = "Web.Controller.ERROR_DB_EXCEPTION";
        public const string ERROR_ID_MISMATCH_KEY = "Web.Controller.ERROR_ID_MISMATCH";
        public const string ERROR_PARAMETER_REQUIRED_KEY = "Web.Controller.ERROR_PARAMETER_REQUIRED";
        public const string ERROR_RESOURCE_NOT_FOUND_KEY = "Web.Controller.ERROR_RESOURCE_NOT_FOUND";

        #endregion Constants


        #region Constructor

        public Controller(IStringLocalizer localizer)
        {
            _localizer = localizer;
        }

        #endregion Constructor


        #region Private Properties

        private ICulture _currentCulture;
        private IStringLocalizer _localizer;

        #endregion Private Properties


        #region Protected Properties

        protected IStringLocalizer Localizer { get => _localizer; }

        #endregion Protected Properties


        #region Public Properties

        public virtual ICulture CurrentCulture
        {
            get
            {
                if (_currentCulture != null)
                {
                    return _currentCulture;
                }

                var feature = HttpContext.Features.Get<IRequestCultureFeature>();
                _currentCulture = LocalizationUtils.CultureByCode(feature.RequestCulture.Culture.Name);

                return _currentCulture;
            }
        }

        #endregion Public Properties


        #region Results

        /// <summary>
        /// Create a result object given the value and errors list
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value"></param>
        /// <param name="errors"></param>
        /// <returns></returns>
        public IResult<T> CreateResult<T>(T value, IEnumerable<IError> errors) => new Result<T>()
        {
            Errors = errors?.ToList(),
            ResultObject = value
        };

        public AcceptedResult Accepted<T>(T value, IEnumerable<IError> errors)
            => base.Accepted(CreateResult(value, errors));

        protected BadRequestObjectResult BadRequest<T>(T value, IEnumerable<IError> errors)
            => base.BadRequest(CreateResult(value, errors));

        protected BadRequestObjectResult BadRequest<T>(T value, params IError[] errors)
            => base.BadRequest(CreateResult(value, errors));

        protected BadRequestObjectResult BadRequest(string key, string message, ErrorType type = ErrorType.Error)
            => base.BadRequest(new List<Error>
            {
                new Error
                {
                    ErrorType = type,
                    Key       = key,
                    Message   = message
                }
            });

        protected BadRequestObjectResult BadRequest<T>(T value, string key, string message, ErrorType type = ErrorType.Error)
            => base.BadRequest(CreateResult(value, new List<Error>
            {
                new Error
                {
                    ErrorType = type,
                    Key       = key,
                    Message   = message
                }
            }));

        public ObjectResult Conflict<T>(T value, IEnumerable<IError> errors)
            => StatusCode(StatusCodes.Status409Conflict, value, errors);

        public ObjectResult Conflict<T>(IEnumerable<IError> errors)
            => StatusCode(StatusCodes.Status409Conflict, default(T), errors);

        public CreatedResult Created<T>(T value)
            => base.Created(string.Empty, CreateResult(value, null));

        public CreatedResult Created<T>(string uri, T value)
            => base.Created(uri, CreateResult(value, null));

        public CreatedResult Created<T>(string uri, T value, IEnumerable<IError> errors)
            => base.Created(uri, CreateResult(value, errors));

        public CreatedResult Created<T>(Uri uri, T value, IEnumerable<IError> errors)
            => base.Created(uri, CreateResult(value, errors));

        public CreatedAtActionResult CreatedAtAction<T>(string actionName, object routeValues, T value, IEnumerable<IError> errors)
            => base.CreatedAtAction(actionName, routeValues, CreateResult(value, errors));

        public CreatedAtActionResult CreatedAtAction<T>(string actionName, string controllerName, object routeValues, T value, IEnumerable<IError> errors)
            => base.CreatedAtAction(actionName, controllerName, routeValues, CreateResult(value, errors));

        public CreatedAtActionResult CreatedAtAction<T>(string actionName, T value, IEnumerable<IError> errors)
            => base.CreatedAtAction(actionName, CreateResult(value, errors));

        public CreatedAtRouteResult CreatedAtRoute<T>(string routeName, T value, IEnumerable<IError> errors)
            => base.CreatedAtRoute(routeName, CreateResult(value, errors));

        public CreatedAtRouteResult CreatedAtRoute<T>(object routeValues, T value, IEnumerable<IError> errors)
            => base.CreatedAtRoute(routeValues, CreateResult(value, errors));

        public CreatedAtRouteResult CreatedAtRoute<T>(string routeName, object routeValues, T value, IEnumerable<IError> errors)
            => base.CreatedAtRoute(routeName, routeValues, CreateResult(value, errors));

        public ObjectResult Forbidden<T>(T value, IEnumerable<IError> errors)
            => StatusCode(403, value, errors);

        public ObjectResult Forbidden<T>(T value, params IError[] errors)
            => StatusCode(403, value, errors);

        public ObjectResult Forbidden<T>(IEnumerable<IError> errors)
            => StatusCode(403, default(T), errors);

        public ObjectResult Forbidden<T>(params IError[] errors)
            => StatusCode(403, default(T), errors);

        public ObjectResult InternalError<T>(T value, IEnumerable<IError> errors, ILogger logger = null)
        {
            logger.LogErrors<T>(value, errors);

            return StatusCode(500, value, errors);
        }

        public ObjectResult InternalError<T>(IEnumerable<IError> errors, ILogger logger = null)
            => InternalError(default(T), errors, logger);

        protected ObjectResult InternalError<T>(string key, string message, ErrorType type = ErrorType.Error, ILogger logger = null)
            => InternalError(default(T), new List<Error>
            {
                new Error
                {
                    ErrorType = type,
                    Key       = key,
                    Message   = message
                }
            }, logger);

        public NotFoundObjectResult NotFound<T>(T value, IEnumerable<IError> errors)
            => base.NotFound(CreateResult(value, errors));

        public NotFoundObjectResult NotFound<T>(IEnumerable<IError> errors)
            => base.NotFound(CreateResult(default(T), errors));

        protected NotFoundObjectResult NotFound<T>(T value, string key, string message, ErrorType type = ErrorType.Error)
            => base.NotFound(CreateResult(value, new List<Error>
            {
                new Error
                {
                    ErrorType = type,
                    Key       = key,
                    Message   = message
                }
            }));

        /// <summary>
        /// Responds with translated 404 Not Found response
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public NotFoundObjectResult NotFound<T>()
            => base.NotFound(CreateResult(default(T), new List<IError> { GetResourceNotFoundError<T>() }));

        public OkObjectResult Ok<T>(T value, IEnumerable<IError> errors)
            => base.Ok(CreateResult(value, errors));

        public ObjectResult StatusCode<T>(int statusCode, T value, IEnumerable<IError> errors)
            => base.StatusCode(statusCode, CreateResult(value, errors));

        #endregion Results

        #region Errors

        protected IError GetIdMismatchError() => new Error
        {
            ErrorType = ErrorType.Error,
            Key = ERROR_ID_MISMATCH_KEY,
            Message = _localizer[ERROR_ID_MISMATCH_KEY]
        };

        protected IError GetIdMismatchError(string routeParameter, string dtoProperty) => new Error
        {
            ErrorType = ErrorType.Error,
            Key = ERROR_ID_MISMATCH_KEY,
            Message = _localizer[ERROR_ID_MISMATCH_KEY, routeParameter, dtoProperty],
        };

        protected IError GetNewError(string key, string message) => new Error
        {
            ErrorType = ErrorType.Error,
            Key = key,
            Message = message,
        };

        protected IError GetResourceNotFoundError() => new Error
        {
            ErrorType = ErrorType.Error,
            Key = ERROR_RESOURCE_NOT_FOUND_KEY,
            Message = _localizer[ERROR_RESOURCE_NOT_FOUND_KEY],
        };

        protected IError GetResourceNotFoundError<T>() => new Error
        {
            ErrorType = ErrorType.Error,
            Key = ERROR_RESOURCE_NOT_FOUND_KEY,
            Message = _localizer[ERROR_RESOURCE_NOT_FOUND_KEY, typeof(T).Name.Replace("Dto", string.Empty)],
        };

        protected IError GetResourceNotFoundError(string resourceName) => new Error
        {
            ErrorType = ErrorType.Error,
            Key = ERROR_RESOURCE_NOT_FOUND_KEY,
            Message = _localizer[ERROR_RESOURCE_NOT_FOUND_KEY, resourceName]
        };

        #endregion Errors
    }
}
