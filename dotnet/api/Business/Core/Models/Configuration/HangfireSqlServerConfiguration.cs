namespace AndcultureCode.GB.Business.Core.Models.Configuration
{
    /// <summary>
    /// Hangfire SQL Server Storage Options
    /// https://docs.hangfire.io/en/latest/configuration/using-sql-server.html
    /// </summary>
    public class HangfireSqlServerConfiguration
    {
        public int CommandBatchMaxTimeout { get; set; }
        public bool DisableGlobalLocks { get; set; }
        public int QueuePollInterval { get; set; }
        public int SlidingInvisibilityTimeout { get; set; }
        public bool UsePageLocksOnDequeue { get; set; }
        public bool UseRecommendedIsolationLevel { get; set; }

    }
}