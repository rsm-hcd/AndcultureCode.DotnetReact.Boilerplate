using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndcultureCode.GB.Business.Core.Models.Configuration;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps;
using AndcultureCode.CSharp.Core.Models.Entities;

namespace Data.SqlServer.Maps.Acls
{
    public class AclMap : Map<Acl>
    {
        public override void Configure(EntityTypeBuilder<Acl> entity)
        {
            entity
               .Property(e => e.Resource)
               .HasMaxLength(DataConfiguration.SHORT_STRING_LENGTH)
               .IsRequired();

            entity
                .Property(e => e.Subject)
                .HasMaxLength(DataConfiguration.SHORT_STRING_LENGTH)
                .IsRequired();

            entity
                .Property(e => e.Verb)
                .HasMaxLength(DataConfiguration.SHORT_STRING_LENGTH)
                .IsRequired();
        }
    }
}