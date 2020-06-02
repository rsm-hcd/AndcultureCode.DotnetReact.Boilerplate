namespace AndcultureCode.GB.Presentation.Web.Models.Dtos.Roles
{
    public class RoleDto : AuditableDto
    {
        #region Properties

        /// <summary>
        /// Short details about this role
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Unique name of the role
        /// </summary>
        public string Name { get; set; }

        #endregion Properties
    }
}