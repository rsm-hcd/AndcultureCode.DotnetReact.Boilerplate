using System;

namespace AndcultureCode.GB.Presentation.Web.Models.Dtos.Users
{
    /// <summary>
    /// Details around authentication attempts.
    /// Both successful and unsuccessful.
    /// </summary>
    public class UserLoginDto : AuditableDto
    {
        #region Properties

        /// <summary>
        /// Was this a successful request?
        /// </summary>
        /// <value></value>
        public bool IsSuccessful { get; set; }

        /// <summary>
        /// Last time the client indicated the keep the login/session alive
        /// </summary>
        /// <value></value>
        public DateTimeOffset? KeepAliveOn { get; set; }

        /// <summary>
        /// Related role's Id
        /// </summary>
        /// <value></value>
        public long? RoleId { get; set; }

        /// <summary>
        /// Related user's Id
        /// </summary>
        /// <value></value>
        public long? UserId { get; set; }

        #endregion Properties


        #region Non-Persisted Properties

        /// <summary>
        /// Password being used for this login attempt
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// UserName being used for this login attempt
        /// </summary>
        /// <value></value>
        public string UserName { get; set; }

        #endregion Non-Persisted Properties
    }
}
