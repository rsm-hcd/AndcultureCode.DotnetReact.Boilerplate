using System;
using System.Linq.Expressions;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.CSharp.Core.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions
{
    public static class EntityTypeBuilderExtensions
    {
        /// <summary>
        /// Applies a filter with the given index expression to constrain the database to only one
        /// non-deleted entity matching the index expression's fields
        /// </summary>
        /// <param name="entityTypeBuilder"></param>
        /// <param name="indexExpression">Expression containing the object's fields to add constraints on</param>
        /// <typeparam name="T"></typeparam>
        public static void HasUniqueNonDeletedIndexFilter<T>(this EntityTypeBuilder<T> entityTypeBuilder, Expression<Func<T, object>> indexExpression) where T : Auditable
        {
            entityTypeBuilder
                .HasIndex(indexExpression)
                .HasFilter("[DeletedOn] IS NULL")
                .IsUnique();
        }
    }
}