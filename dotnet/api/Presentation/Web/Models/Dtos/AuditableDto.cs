using System;
using AndcultureCode.GB.Presentation.Web.Models.Dtos;

namespace AndcultureCode.GB.Presentation.Web.Models
{
    public class AuditableDto : EntityDto
    {
        /// <summary>The id of the user that created the record</summary>
        public long? CreatedById { get; set; }

        /// <summary>The datetime that the record was created</summary>
        public DateTimeOffset? CreatedOn { get; set; }

        /// <summary>The id of the user that deleted the record</summary>
        public long? DeletedById { get; set; }

        /// <summary>The datetime that the record was deleted</summary>
        public DateTimeOffset? DeletedOn { get; set; }

        /// <summary>The id of the user that last updated the record</summary>
        public long? UpdatedById { get; set; }

        /// <summary>The datetime that the record was last updated</summary>
        public DateTimeOffset? UpdatedOn { get; set; }
    }
}