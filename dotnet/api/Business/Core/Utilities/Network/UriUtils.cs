using System;

namespace AndcultureCode.GB.Business.Core.Utilities.Network
{
    public static class UriUtil
    {
        public static bool IsInvalidHttpUrl(string source) => !IsValidHttpUrl(source);

        public static bool IsValidHttpUrl(string source)
        {
            if (string.IsNullOrWhiteSpace(source))
            {
                return false;
            }

            Uri uriResult;
            return Uri.TryCreate(source, UriKind.Absolute, out uriResult) && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }
    }
}
