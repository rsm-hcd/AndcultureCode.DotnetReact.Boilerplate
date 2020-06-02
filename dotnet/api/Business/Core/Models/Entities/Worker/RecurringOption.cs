using System;
using AndcultureCode.GB.Business.Core.Enumerations;

namespace AndcultureCode.GB.Business.Core.Models.Entities.Worker
{
    public class RecurringOption
    {
        public int Day { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public int Hour { get; set; }
        public int Minute { get; set; }
        public int Month { get; set; }
        public Recurrence Recurrence { get; set; }
    }
}