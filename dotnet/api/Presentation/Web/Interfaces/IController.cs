using System;
using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Enumerations;
using AndcultureCode.CSharp.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Web.Interfaces
{
    public interface IController
    {
        #region Properties

        ICulture CurrentCulture { get; }

        #endregion Properties

        #region Methods

        AcceptedResult Accepted<T>(T value, IEnumerable<IError> errors);
        BadRequestObjectResult BadRequest<T>(IEnumerable<IError> errors);
        BadRequestObjectResult BadRequest<T>(T value, IEnumerable<IError> errors);
        BadRequestObjectResult BadRequest<T>(T value, params IError[] errors);
        BadRequestObjectResult BadRequest(string key, string message, ErrorType type = ErrorType.Error);
        BadRequestObjectResult BadRequest<T>(T value, string key, string message, ErrorType type = ErrorType.Error);
        ObjectResult Conflict<T>(T value, IEnumerable<IError> errors);
        ObjectResult Conflict<T>(IEnumerable<IError> errors);
        CreatedResult Created<T>(T value);
        CreatedResult Created<T>(long uriIdentifier, T value);
        CreatedResult Created<T>(string uri, T value);
        CreatedResult Created<T>(string uri, T value, IEnumerable<IError> errors);
        CreatedResult Created<T>(Uri uri, T value, IEnumerable<IError> errors);
        CreatedAtActionResult CreatedAtAction<T>(string actionName, object routeValues, T value, IEnumerable<IError> errors);
        CreatedAtActionResult CreatedAtAction<T>(string actionName, string controllerName, object routeValues, T value, IEnumerable<IError> errors);
        CreatedAtActionResult CreatedAtAction<T>(string actionName, T value, IEnumerable<IError> errors);
        CreatedAtRouteResult CreatedAtRoute<T>(string routeName, T value, IEnumerable<IError> errors);
        CreatedAtRouteResult CreatedAtRoute<T>(object routeValues, T value, IEnumerable<IError> errors);
        CreatedAtRouteResult CreatedAtRoute<T>(string routeName, object routeValues, T value, IEnumerable<IError> errors);
        IResult<T> CreateResult<T>(T value, IEnumerable<IError> errors);
        ObjectResult Forbidden<T>(T value, IEnumerable<IError> errors);
        ObjectResult Forbidden<T>(T value, params IError[] errors);
        ObjectResult Forbidden<T>(IEnumerable<IError> errors);
        ObjectResult Forbidden<T>(params IError[] errors);
        ObjectResult InternalError<T>(T value, IEnumerable<IError> errors, ILogger logger = null);
        ObjectResult InternalError<T>(IEnumerable<IError> errors, ILogger logger = null);
        ObjectResult InternalError<T>(string key, string message, ErrorType type = ErrorType.Error, ILogger logger = null);
        NotFoundObjectResult NotFound<T>(T value, IEnumerable<IError> errors);
        NotFoundObjectResult NotFound<T>(IEnumerable<IError> errors);
        NotFoundObjectResult NotFound<T>(T value, string key, string message, ErrorType type = ErrorType.Error);
        NotFoundObjectResult NotFound<T>();
        OkObjectResult Ok<T>(T value, IEnumerable<IError> errors);
        ObjectResult StatusCode<T>(int statusCode, T value, IEnumerable<IError> errors);

        #endregion Methods
    }
}
