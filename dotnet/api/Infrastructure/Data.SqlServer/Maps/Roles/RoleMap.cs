using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.CSharp.Core.Models.Configuration;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps.Roles
{
    public class RoleMap : Map<Role>
    {
        public override void Configure(EntityTypeBuilder<Role> entity)
        {
            entity
                .Property(e => e.Description)
                    .HasMaxLength(DataConfiguration.LONG_DESCRIPTION_LENGTH);

            entity
                .Property(e => e.Name)
                    .HasMaxLength(DataConfiguration.SHORT_STRING_LENGTH)
                    .IsRequired();

            entity
                .HasIndex(e => e.Name)
                .IsUnique();
        }
    }
}