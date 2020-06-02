using System.Reflection;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Interfaces.Data;
using AndcultureCode.CSharp.Core.Models.Entities;
using AndcultureCode.CSharp.Testing.Tests;
using AndcultureCode.GB.Testing.Extensions;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Testing.Tests
{
    public class ApiIntegrationTest : BaseIntegrationTest
    {
        #region Constructors

        public ApiIntegrationTest(
            ITestOutputHelper output,
            IContext context = null,
            IRepository<Entity> repository = null) : base(output, context, repository)
        {
        }

        static ApiIntegrationTest()
        {
            LoadFactories(typeof(ApiIntegrationTest).GetTypeInfo().Assembly);
        }

        #endregion

        #region BaseIntegrationTest Overrides

        public override T Create<T>(IContext context, T item)
        {
            if (item is Entity)
            {
                return item.Create(context);
            }
            return base.Create(context, item);
        }
        #endregion
    }
}