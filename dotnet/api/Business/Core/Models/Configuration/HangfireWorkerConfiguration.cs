namespace AndcultureCode.GB.Business.Core.Models.Configuration
{
    public class HangfireWorkerConfiguration
    {
        public bool IsDashboardEnabled { get; set; }
        public bool IsServerEnabled { get; set; }
        public string Password { get; set; }
        public string[] Queues { get; set; }
        public bool Ssl { get; set; }
        public HangfireSqlServerConfiguration SqlServerOptions { get; set; }
        public int WorkerCount { get; set; }

    }
}