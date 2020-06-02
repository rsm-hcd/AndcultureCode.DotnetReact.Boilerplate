using System;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions.Seeds;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions
{
    public static class GBApiContextExtensions
    {
        #region Public Methods

        public static void EnsureSeedData(this GBApiContext context, bool hasDevelopmentData)
        {
            Console.WriteLine("[GBApiContextExtensions#EnsureSeedData] Seeding Production Data...");

            context.SeedSystemSettings();

            if (hasDevelopmentData)
            {
                Console.WriteLine("Seeding Development Data...");
                context.SeedRoles();
            }
        }

        #endregion Public Methods

    }
}
