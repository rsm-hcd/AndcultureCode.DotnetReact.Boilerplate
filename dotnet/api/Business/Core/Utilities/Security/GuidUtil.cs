using System;

namespace AndcultureCode.GB.Business.Core.Utilities.Security
{
    public class GuidUtil
    {
        public static bool IsInvalid(string guidString) => !IsValid(guidString);

        public static bool IsValid(string guidString)
        {
            try
            {
                new Guid(guidString);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}