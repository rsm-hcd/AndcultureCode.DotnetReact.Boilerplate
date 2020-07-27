namespace AndcultureCode.GB.Business.Core.Models.Configuration
{
    public class CookieAuthenticationConfiguration
    {
        public string AccessDeniedPath { get; set; }
        public string AuthenticationScheme { get; set; }
        public string CookieName { get; set; }
        public bool IsEnabled { get; set; }
        public string LoginPath { get; set; }
    }
}
