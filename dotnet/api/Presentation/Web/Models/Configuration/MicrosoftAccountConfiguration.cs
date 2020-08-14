namespace Web.Models.Configuration
{
    public class MicrosoftAccountConfiguration
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public bool IsEnabled { get; set; }
        public string Scope { get; set; }
    }
}
