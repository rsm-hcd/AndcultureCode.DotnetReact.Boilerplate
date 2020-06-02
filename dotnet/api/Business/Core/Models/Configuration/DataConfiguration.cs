namespace AndcultureCode.GB.Business.Core.Models.Configuration
{
    public class DataConfiguration
    {
        public const int EMAIL_LENGTH = 250;

        /// <summary>
        /// Maximum storage length for IP address columns.
        /// IPv4 is 15 characters and IPv6 is 39 characters
        /// </summary>
        public const int IP_ADDRESS_LENGTH = 39;

        public const int EXTRA_SHORT_STRING_LENGTH = 100;
        public const int LONG_DESCRIPTION_LENGTH = 1000;
        public const int SHORT_DESCRIPTION_LENGTH = 500;
        public const int SHORT_STRING_LENGTH = 150;
        public const int SHORT_TITLE_LENGTH = 60;

        /// <summary>
        /// IE has a max of 2083
        /// </summary>
        public const int URL_LENGTH = 2083;
    }
}
