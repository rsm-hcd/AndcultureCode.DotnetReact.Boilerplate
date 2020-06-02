using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps
{
    public abstract class Map<TEntity> where TEntity : class
    {
        public abstract void Configure(EntityTypeBuilder<TEntity> entity);
    }
}