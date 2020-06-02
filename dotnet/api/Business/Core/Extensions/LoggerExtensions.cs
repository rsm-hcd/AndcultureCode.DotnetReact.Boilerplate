using System.Collections.Generic;
using System.Linq;
using AndcultureCode.CSharp.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    public static class LoggerExtensions
    {
        public static void LogErrors<T>(this ILogger logger, T value, IEnumerable<IError> errors)
        {
            var errorString = errors != null ?
                string.Join(", ", errors.Select(e => e.Message)) :
                "No errors were specified";

            if (logger != null)
            {
                logger.LogError(errorString, value);
            }

        }

    }
}