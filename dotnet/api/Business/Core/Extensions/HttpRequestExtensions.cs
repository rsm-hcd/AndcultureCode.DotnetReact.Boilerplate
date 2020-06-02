using Microsoft.AspNetCore.Http;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    public static class HttpRequestExtensions
    {
        #region Constants

        public const string X_FORWARDED_FOR = "X-Forwarded-For";

        #endregion Constants

        /// <summary>
        /// Retrieves the client's forwarded IP address, if present. Returns null otherwise.
        /// </summary>
        /// <param name="httpRequest"></param>
        /// <returns></returns>
        public static string GetForwardedIpAddress(this HttpRequest httpRequest)
        {
            if (httpRequest == null ||
                httpRequest.Headers == null ||
                !httpRequest.Headers.ContainsKey(X_FORWARDED_FOR) ||
                string.IsNullOrWhiteSpace(httpRequest.Headers[X_FORWARDED_FOR])
            )
            {
                return null;
            }

            return httpRequest.Headers[X_FORWARDED_FOR];
        }
    }
}
