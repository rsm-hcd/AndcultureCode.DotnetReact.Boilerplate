using System;
using AndcultureCode.CSharp.Conductors;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Models;
using AndcultureCode.CSharp.Core.Models.Entities;
using AndcultureCode.GB.Business.Core.Models.Entities;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Repositories;

namespace AndcultureCode.GB.Testing.Extensions
{
    public static class EntityExtensions
    {
        public static T Create<T>(this T entity, IContext context) where T : Entity
        {
            var cachedCreatedOn = (entity is Auditable) ? (entity as Auditable).CreatedOn : null;
            var repository = new RepositoryCreateConductor<T>(new Repository<T>(context));
            var createResult = repository.Create(entity);
            createResult.ThrowIfAnyErrors();

            if (cachedCreatedOn == null)
            {
                return createResult.ResultObject;
            }

            // Allow createdOn to be explicitly set from testing
            Console.WriteLine("EntityExtensions.Create explicit CreatedOn supplied performing additional update.");
            (createResult.ResultObject as Auditable).CreatedOn = cachedCreatedOn;
            var updateRepository = new RepositoryUpdateConductor<T>(new Repository<T>(context));
            var updateResult = updateRepository.Update(createResult.ResultObject);
            updateResult.ThrowIfAnyErrors();

            return createResult.ResultObject;
        }
    }
}