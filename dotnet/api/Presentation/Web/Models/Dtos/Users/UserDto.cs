using System;
using System.Collections.Generic;

namespace AndcultureCode.GB.Presentation.Web.Models.Dtos.Users
{
    public class UserDto : AuditableDto
    {
        /// <summary>
        /// User email address
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// User first name
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// Whether the user is a superadmin
        /// </summary>
        public bool IsSuperAdmin { get; set; }

        /// <summary>
        /// User last name
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// User password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Unique ID for the user
        /// </summary>
        public string UserName { get; set; }
    }
}
