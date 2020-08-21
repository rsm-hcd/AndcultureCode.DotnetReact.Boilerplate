using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndcultureCode.CSharp.Core.Models.Configuration;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps.Users
{
    public class UserMap : Map<User>
    {
        public override void Configure(EntityTypeBuilder<User> entity)
        {
            entity
                .Property(e => e.Email)
                .IsRequired();

            entity
                .HasIndex(e => e.Email)
                .IsUnique();

            entity
                .Property(e => e.PasswordHash)
                    .HasMaxLength(DataConfiguration.SHORT_STRING_LENGTH);

            entity
                .Property(e => e.SecurityStamp)
                    .HasMaxLength(DataConfiguration.SHORT_STRING_LENGTH);

            entity
                .Property(e => e.UserName)
                .IsRequired();

            entity
                .HasIndex(e => e.UserName)
                .IsUnique();
        }
    }
}
