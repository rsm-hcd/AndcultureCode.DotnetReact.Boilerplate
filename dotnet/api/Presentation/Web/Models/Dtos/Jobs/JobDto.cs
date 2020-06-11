using System;
using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Enumerations;

namespace AndcultureCode.GB.Presentation.Web.Models.Dtos.Jobs
{
    public class JobDto : AuditableDto
    {
        /// <summary>
        /// Background Job Id from Worker Provider
        /// </summary>
        /// <value></value>
        public string BackgroundJobId { get; set; }

        /// <summary>
        /// Saved debug information.  i.e. Result objects.
        /// </summary>
        /// <value></value>
        public string DebugJson { get; set; }

        /// <summary>
        /// Timestamp for when the job completed or errored.
        /// </summary>
        /// <value></value>
        public DateTimeOffset? EndedOn { get; set; }

        /// <summary>
        /// Error or list of errors from background job.
        /// </summary>
        /// <value></value>
        public string Error { get; set; }

        /// <summary>
        /// Timestamp for when the job was started.  i.e. When Execute was called.
        /// </summary>
        /// <value></value>
        public DateTimeOffset? StartedOn { get; set; }

        /// <summary>
        /// Id of user that requested the job.
        /// </summary>
        /// <value></value>
        public long? StartedById { get; set; }

        /// <summary>
        /// JobStatus enum representing the status of the job.
        /// </summary>
        /// <value></value>
        public JobStatus? Status { get; set; }

        /// <summary>
        /// Name field from Worker class to be executed for job.
        /// </summary>
        /// <value></value>

        public string WorkerName { get; set; }

        /// <summary>
        /// Arguments to be passed along to the worker Action method.  Must be a JSON string.
        /// That can be deserialized to a list of objects.
        /// Arguments must be built in C# types.
        /// </summary>
        /// <value></value>
        public string WorkerArgs { get; set; }
    }
}