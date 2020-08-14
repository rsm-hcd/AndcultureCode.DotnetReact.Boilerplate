using System;

namespace Web.Models
{
    public class MicrosoftAccountUser
    {
        public object[] BusinessPhones { get; set; }

        /// <summary>
        /// General 'name'
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// First name
        /// </summary>
        public string GivenName { get; set; }

        public Guid Id { get; set; }
        public string JobTitle { get; set; }

        /// <summary>
        /// Email address
        /// </summary>
        public string Mail { get; set; }
        public string MobilePhone { get; set; }
        public object OfficeLocation { get; set; }

        /// <summary>
        /// Locale, ex: "en-US"
        /// </summary>
        public string PreferredLanguage { get; set; }

        /// <summary>
        /// Last Name
        /// </summary>
        public string Surname { get; set; }
        public string UserPrincipalName { get; set; }
    }
}
