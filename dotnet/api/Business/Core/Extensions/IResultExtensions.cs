using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using AndcultureCode.CSharp.Core.Enumerations;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    public static class IResultExtensions
    {
        #region AddError

        /// <summary>
        /// Add translated error record
        /// </summary>
        /// <param name="result"></param>
        /// <param name="localizer"></param>
        /// <param name="key">Error key found in culture files</param>
        /// <param name="arguments">The values with which to format the translated error message</param>
        public static IError AddError<T>(this IResult<T> result, IStringLocalizer localizer, ErrorType type, string key, params object[] arguments)
            => result.AddError(type, key, localizer[key, arguments]);

        /// <summary>
        /// Add translated error record of type Error
        /// </summary>
        /// <param name="result"></param>
        /// <param name="localizer"></param>
        /// <param name="key">Error key found in culture files</param>
        /// <param name="arguments">The values with which to format the translated error message</param>
        public static IError AddError<T>(this IResult<T> result, IStringLocalizer localizer, string key, params object[] arguments)
            => result.AddError(key, localizer[key, arguments]);

        /// <summary>
        /// Add translated error record of type Validation
        /// </summary>
        /// <param name="result"></param>
        /// <param name="localizer"></param>
        /// <param name="key">Error key found in culture files</param>
        /// <param name="arguments">The values with which to format the translated error message</param>
        public static IError AddValidationError<T>(this IResult<T> result, IStringLocalizer localizer, string key, params object[] arguments)
            => result.AddValidationError(key, localizer[key, arguments]);

        #endregion AddError

        #region AddErrorAndLog

        /// <summary>
        /// Add translated error record and log un-translated message
        /// </summary>
        /// <param name="result"></param>
        /// <param name="logger"></param>
        /// <param name="localizer"></param>
        /// <param name="errorKey">Error key found in culture files</param>
        /// <param name="arguments">The values with which to format the translated error message</param>
        public static void AddErrorAndLog<T>(this IResult<T> result, ILogger logger, IStringLocalizer localizer, string errorKey, params object[] arguments)
        {
            var errorMessage = localizer[errorKey, arguments];
            var logMessage = localizer.Default(errorKey, arguments);
            var methodName = new StackTrace().GetFrame(1).GetMethod().Name;
            result.AddErrorsAndLog<T>(logger, errorKey, errorMessage, logMessage, null, null, methodName);
        }

        /// <summary>
        /// Add translated error record and log un-translated message
        /// </summary>
        /// <param name="result"></param>
        /// <param name="logger"></param>
        /// <param name="localizer"></param>
        /// <param name="errorKey">Error key found in culture files</param>
        /// <param name="resourceIdentifier"></param>
        /// <param name="arguments">The values with which to format the translated error message</param>
        public static void AddErrorAndLog<T>(this IResult<T> result, ILogger logger, IStringLocalizer localizer, string errorKey, long? resourceIdentifier, params object[] arguments)
        {
            var errorMessage = localizer[errorKey, arguments];
            var logMessage = localizer.Default(errorKey, arguments);
            var methodName = new StackTrace().GetFrame(1).GetMethod().Name;
            result.AddErrorsAndLog<T>(logger, errorKey, errorMessage, logMessage, resourceIdentifier?.ToString(), null, methodName);
        }

        /// <summary>
        /// Add translated error record and log un-translated message
        /// </summary>
        /// <param name="result"></param>
        /// <param name="logger"></param>
        /// <param name="localizer"></param>
        /// <param name="errorKey">Error key found in culture files</param>
        /// <param name="resourceIdentifier"></param>
        /// <param name="arguments">The values with which to format the translated error message</param>
        public static void AddErrorAndLog<T>(this IResult<T> result, ILogger logger, IStringLocalizer localizer, string errorKey, long resourceIdentifier, params object[] arguments)
        {
            var errorMessage = localizer[errorKey, arguments];
            var logMessage = localizer.Default(errorKey, arguments);
            var methodName = new StackTrace().GetFrame(1).GetMethod().Name;
            result.AddErrorsAndLog<T>(logger, errorKey, errorMessage, logMessage, resourceIdentifier.ToString(), null, methodName);
        }

        /// <summary>
        /// Add translated error record and log un-translated message
        /// </summary>
        /// <param name="result"></param>
        /// <param name="logger"></param>
        /// <param name="localizer"></param>
        /// <param name="errorKey">Error key found in culture files</param>
        /// <param name="resourceIdentifier"></param>
        /// <param name="errors">Additional errors to forward. These are assumed to have already been translated.</param>
        /// <param name="arguments">The values with which to format the translated error message</param>
        public static void AddErrorsAndLog<T>(this IResult<T> result, ILogger logger, IStringLocalizer localizer, string errorKey, long resourceIdentifier, IEnumerable<IError> errors = null, params object[] arguments)
        {
            var errorMessage = localizer[errorKey, arguments];
            var logMessage = localizer.Default(errorKey, arguments);
            var methodName = new StackTrace().GetFrame(1).GetMethod().Name;
            result.AddErrorsAndLog<T>(logger, errorKey, errorMessage, logMessage, resourceIdentifier.ToString(), errors, methodName);
        }

        /// <summary>
        /// Add error record and log message
        /// </summary>
        /// <param name="result"></param>
        /// <param name="logger"></param>
        /// <param name="errorKey">Error key found in culture files</param>
        /// <param name="errorMessage">Translated error message</param>
        /// <param name="logMessage">Log message - commonly un-translated version of errorMessage</param>
        /// <param name="resourceIdentifier"></param>
        /// <param name="errors">Additional errors to forward. These are assumed to have already been translated.</param>
        /// <param name="methodName">Name of calling method for use in log message for improved debugging</param>
        public static void AddErrorsAndLog<T>(this IResult<T> result, ILogger logger, string errorKey, string errorMessage, string logMessage, string resourceIdentifier, IEnumerable<IError> errors = null, string methodName = null)
        {
            if (string.IsNullOrWhiteSpace(errorMessage))
            {
                errorMessage = "";
            }

            // Add singular error
            if (!string.IsNullOrWhiteSpace(errorKey))
            {
                result.AddError(errorKey, errorMessage);
            }

            // Add error list
            if (errors != null && errors.Any())
            {
                result.AddErrors(errors);
            }

            var identifierText = !string.IsNullOrWhiteSpace(resourceIdentifier) ? $" ({resourceIdentifier}) -" : "";

            // If not provided, try to detect method name
            if (string.IsNullOrWhiteSpace(methodName))
            {
                methodName = new StackTrace().GetFrame(1).GetMethod().Name;
            }

            // Log all of the above
            logger.LogError($"[{methodName}]{identifierText} {logMessage}");
        }

        #endregion AddErrorAndLog
    }

}