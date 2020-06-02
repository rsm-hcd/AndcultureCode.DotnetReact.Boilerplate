using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndcultureCode.GB.Business.Core.Models.Configuration;
using AndcultureCode.GB.Business.Core.Models.Jobs;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps.Jobs
{
    public class JobMap : Map<Job>
    {
        public override void Configure(EntityTypeBuilder<Job> entity)
        {
            entity
                .Property(e => e.BackgroundJobId)
                .HasMaxLength(DataConfiguration.LONG_DESCRIPTION_LENGTH);

            entity
                .Property(e => e.WorkerName)
                .HasMaxLength(DataConfiguration.SHORT_STRING_LENGTH)
                .IsRequired();

            entity
                .Property(e => e.WorkerArgs)
                .HasMaxLength(DataConfiguration.LONG_DESCRIPTION_LENGTH);
        }
    }
}
