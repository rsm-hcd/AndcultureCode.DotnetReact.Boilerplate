namespace AndcultureCode.GB.Presentation.Web.Models.Dtos.SystemSettings
{
    public class SystemSettingsDto
    {
        /// <summary>
        /// Name of current configured database. Not available in production environments.
        /// </summary>
        /// <value></value>
        public string DatabaseName { get; set; }

        /// <summary>
        /// Name of configured envirionment (ie. development, working, production)
        /// </summary>
        public string EnvironmentName { get; set; }

        /// <summary>
        /// Machine name of computer, vm, etc... servicing this request
        /// </summary>
        /// <value></value>
        public string MachineName { get; set; }
    }
}
