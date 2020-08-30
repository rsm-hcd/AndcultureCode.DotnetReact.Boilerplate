using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using AndcultureCode.CSharp.Core.Models.Configuration;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps.Users
{
    public class UserLoginMap : Map<UserLogin>
    {
        public override void Configure(EntityTypeBuilder<UserLogin> entity)
        {
            entity
                .Property(e => e.Ip)
                    .HasMaxLength(DataConfiguration.IP_ADDRESS_LENGTH);

            entity
                .Property(e => e.ServerName)
                    .HasMaxLength(DataConfiguration.SHORT_STRING_LENGTH);
        }
    }
}
