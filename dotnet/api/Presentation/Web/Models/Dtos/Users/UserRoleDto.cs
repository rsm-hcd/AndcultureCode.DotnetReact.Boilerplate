using System;
namespace AndcultureCode.GB.Presentation.Web.Models.Dtos.Users
{
    /// <summary>
    /// Bridge entity between a given user and role
    /// </summary>
    public class UserRoleDto : AuditableDto
    {
        #region Properties

        /// <summary>
        /// Related role Id
        /// </summary>
        public long RoleId { get; set; }

        /// <summary>
        /// Related user id
        /// </summary>
        public long UserId { get; set; }

        #endregion Properties
    }
}