using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

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
                .Property(e => e.UserName)
                .IsRequired();

            entity
                .HasIndex(e => e.UserName)
                .IsUnique();
        }
    }
}