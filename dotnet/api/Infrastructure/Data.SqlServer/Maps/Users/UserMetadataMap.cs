using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using AndcultureCode.CSharp.Core.Models.Configuration;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps.Users
{
    public class UserMetadataMap : Map<UserMetadata>
    {
        public override void Configure(EntityTypeBuilder<UserMetadata> entity)
        {
            entity
                .Property(e => e.IsNameEditable)
                    .HasDefaultValue(false)
                    .IsRequired();

            entity
                .Property(e => e.Name)
                    .HasMaxLength(DataConfiguration.SHORT_STRING_LENGTH)
                    .IsRequired();

            entity
                .Property(e => e.Type)
                    .HasMaxLength(DataConfiguration.SHORT_TITLE_LENGTH)
                    .IsRequired();

            entity
                .Property(e => e.UserId)
                    .IsRequired();

            entity
                .Property(e => e.Value)
                    .HasMaxLength(DataConfiguration.LONG_DESCRIPTION_LENGTH);

            entity
                .HasIndex(e => new { e.Name, e.RoleId, e.Type, e.UserId })
                .HasFilter("[DeletedOn] IS NULL")
                .IsUnique();
        }
    }
}
