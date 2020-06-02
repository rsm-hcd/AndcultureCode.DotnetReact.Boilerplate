using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps.Users
{
    public class UserRoleMap : Map<UserRole>
    {
        public override void Configure(EntityTypeBuilder<UserRole> entity)
        {

        }
    }
}