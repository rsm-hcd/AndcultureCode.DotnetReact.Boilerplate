using Hangfire;
using Hangfire.Storage;
using AndcultureCode.CSharp.Core.Enumerations;
using System;
using System.Linq.Expressions;
using AndcultureCode.CSharp.Core.Constants;
using AndcultureCode.CSharp.Core.Models.Entities.Worker;
using AndcultureCode.CSharp.Core.Providers.Worker;

namespace AndcultureCode.GB.Infrastructure.Workers.Hangfire.Providers
{
    public class HangfireWorkerProvider : WorkerProvider
    {
        #region Properties

        public override bool Implemented => true;

        #endregion Properties

        #region Public Methods

        public override bool Delete(string id) => BackgroundJob.Delete(id);
        public override long DeletedCount() => JobStorage.Current.GetMonitoringApi().DeletedListCount();

        public override string Enqueue(Expression<Action> methodCall) => BackgroundJob.Enqueue(methodCall);
        public override string Enqueue<T>(Expression<Action<T>> methodCall) => BackgroundJob.Enqueue(methodCall);

        public override long EnqueuedCount(string queue = Queue.DEFAULT) => JobStorage.Current.GetMonitoringApi().EnqueuedCount(queue);

        // TODO: Not using so commenting out for now to reduce dependencies.
        // public override Result<IJobDetails> GetJob(string id)
        // {
        //     var result = new Result<IJobDetails>();

        //     try
        //     {
        //         var monitor = JobStorage.Current.GetMonitoringApi();
        //         var details = monitor.JobDetails(id);
        //         if (details == null)
        //         {
        //             result.AddError(ErrorType.Error, "GetJob", $"Job id '{id}' does not exist");
        //             return result;
        //         }

        //         result.ResultObject = new JobDetails
        //         {
        //             CreatedAt  = details.CreatedAt,
        //             ExpireAt   = details.ExpireAt,
        //             Properties = details.Properties
        //         };
        //     }
        //     catch (Exception ex)
        //     {
        //         result.AddError(ErrorType.Error, "GetJob", ex.Message);
        //     }

        //     return result;
        // }

        // TODO: Not using so commenting out for now to reduce dependencies.
        // public override Result<IRecurringJobDetails> GetRecurringJob(string id)
        // {
        //     var result = new Result<IRecurringJobDetails>();

        //     try
        //     {
        //         using (var connection = JobStorage.Current.GetConnection())
        //         {
        //             var job = connection.GetRecurringJobs().FirstOrDefault(p => p.Id == id);
        //             if (job == null)
        //             {
        //                 result.AddError(ErrorType.Error, "GetRecurringJob", $"Job id '{id}' does not exist");
        //                 return result;
        //             }

        //             result.ResultObject = new RecurringJobDetails
        //             {
        //                 Chron         = job.Cron,
        //                 Id            = job.Id,
        //                 Job           = job.Job,
        //                 LastExecution = job.LastExecution,
        //                 LastJobId     = job.LastJobId,
        //                 LastJobState  = job.LastJobState,
        //                 LoadException = job.LoadException,
        //                 NextExecution = job.NextExecution,
        //                 Removed       = job.Removed,
        //                 TimeZoneId    = job.TimeZoneId
        //             };
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         result.AddError(ErrorType.Error, "GetRecurringJob", ex.Message);
        //     }

        //     return result;
        // }

        public override void Recur(string id, Expression<Action> methodCall, RecurringOption recurringOptions) => RecurringJob.AddOrUpdate(id, methodCall, GetCronExpression(recurringOptions), TimeZoneInfo.Local);

        public override void Recur<T>(string id, Expression<Action<T>> methodCall, string chronExpression) => RecurringJob.AddOrUpdate(id, methodCall, chronExpression, TimeZoneInfo.Local);

        public override void Recur<T>(string id, Expression<Action<T>> methodCall, RecurringOption recurringOptions) => RecurringJob.AddOrUpdate(id, methodCall, GetCronExpression(recurringOptions), TimeZoneInfo.Local);

        public override long RecurringCount() => JobStorage.Current.GetConnection().GetRecurringJobs().Count;

        public override void RemoveRecurrence(string id) => RecurringJob.RemoveIfExists(id);

        public override string Schedule(Expression<Action> methodCall, TimeSpan delay) => BackgroundJob.Schedule(methodCall, delay);

        public override string Schedule<T>(Expression<Action<T>> methodCall, TimeSpan delay) => BackgroundJob.Schedule<T>(methodCall, delay);

        public override string Schedule(Expression<Action> methodCall, DateTimeOffset enqueueOn) => BackgroundJob.Schedule(methodCall, enqueueOn);

        public override string Schedule<T>(Expression<Action<T>> methodCall, DateTimeOffset enqueueOn) => BackgroundJob.Schedule<T>(methodCall, enqueueOn);

        public long ScheduledCount() => JobStorage.Current.GetMonitoringApi().ScheduledCount();

        #endregion Public Methods


        #region Private Methods

        /// <summary>
        /// Get the cron expression from the recurring options
        /// </summary>
        /// <param name="recurringOptions"></param>
        /// <returns></returns>
        private string GetCronExpression(RecurringOption recurringOptions)
        {
            var cronExpression = string.Empty;
            recurringOptions.Day = recurringOptions.Day == 0 ? 1 : recurringOptions.Day;

            switch (recurringOptions.Recurrence)
            {
                case Recurrence.Daily:
                    cronExpression = Cron.Daily(recurringOptions.Hour, recurringOptions.Minute);
                    break;
                case Recurrence.Hourly:
                    cronExpression = Cron.Hourly(recurringOptions.Minute);
                    break;
                case Recurrence.Minutely:
                    cronExpression = Cron.Minutely();
                    break;
                case Recurrence.Monthly:
                    cronExpression = Cron.Monthly(recurringOptions.Day, recurringOptions.Hour, recurringOptions.Minute);
                    break;
                case Recurrence.Weekly:
                    cronExpression = Cron.Weekly(recurringOptions.DayOfWeek, recurringOptions.Hour, recurringOptions.Minute);
                    break;
                case Recurrence.Yearly:
                    cronExpression = Cron.Yearly(recurringOptions.Month, recurringOptions.Day, recurringOptions.Hour, recurringOptions.Minute);
                    break;
            }

            return cronExpression;
        }

        #endregion Private Methods
    }
}
