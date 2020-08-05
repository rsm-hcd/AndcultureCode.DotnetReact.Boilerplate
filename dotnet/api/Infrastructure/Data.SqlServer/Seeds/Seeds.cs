using System;
using AndcultureCode.CSharp.Core;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Seeds.Development;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Seeds
{
    public class Seeds : SeedsBase<GBApiContext>
    {
        #region Constructor

        public Seeds(IServiceProvider serviceProvider, bool isDevelopment = false)
            : base(serviceProvider, isDevelopment) { }

        #endregion Constructor

        #region Protected Methods

        protected override void CreateBase()
        {

        }

        protected override void CreateDevelopment()
        {
            this.SeedUsers();
        }

        #endregion Protected Methods
    }
}
