using Data.SqlServer.Maps.Acls;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Business.Core.Interfaces.Data;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Business.Core.Models.Jobs;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps.Jobs;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps.Roles;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Maps.Users;
using System;
using System.Linq;
using System.Linq.Expressions;
using AndcultureCode.CSharp.Core.Models.Entities;
using AndcultureCode.CSharp.Core.Interfaces.Data;
using AndcultureCode.CSharp.Core.Utilities.Configuration;
using AndcultureCode.CSharp.Data.Interfaces;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer
{
    public class GBApiContext : Context, IDatabaseContext, IGBApiContext
    {
        #region Properties

        public DbSet<Acl> Acls { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserLogin> UserLogins { get; set; }
        public DbSet<UserMetadata> UserMetadata { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        #endregion Properties

        #region Constructor

        public GBApiContext()
        : base(ConfigurationUtils.GetConnectionString(), null)
        {
            // Uncomment for debugging purposes only
            // Console.WriteLine($"GBApiContext () => {Configuration.GetConnectionString()}");
        }

        public GBApiContext(string connectionString)
        : base(connectionString, null)
        {
            // Uncomment for debugging purposes only
            // Console.WriteLine($"GBApiContext () => {Configuration.GetConnectionString()}");
        }

        public GBApiContext(string connectionString, ILoggerFactory loggerFactory)
        : base(connectionString, loggerFactory)
        {
            // Uncomment for debugging purposes only
            // Console.WriteLine($"GBApiContext () => {Configuration.GetConnectionString()}");
        }

        #endregion Constructor

        #region IGBApiContextImplementation

        IQueryable<Acl> IApplicationContext.Acls => Acls;
        IQueryable<Job> IGBApiContext.Jobs => Jobs;
        IQueryable<Role> IGBApiContext.Roles => Roles;
        IQueryable<User> IGBApiContext.Users => Users;
        IQueryable<UserLogin> IGBApiContext.UserLogins => UserLogins;
        IQueryable<UserMetadata> IGBApiContext.UserMetadata => UserMetadata;
        IQueryable<UserRole> IGBApiContext.UserRoles => UserRoles;


        #endregion IGBApiContextImplementation

        #region Public Methods

        public override void ConfigureMappings(ModelBuilder modelBuilder)
        {
            // Acls
            modelBuilder.AddMapping(new AclMap());

            // Jobs
            modelBuilder.AddMapping(new JobMap());

            // Roles
            modelBuilder.AddMapping(new RoleMap());

            // Users
            modelBuilder.AddMapping(new UserMap());

            // UserLogins
            modelBuilder.AddMapping(new UserLoginMap());

            // UserMetadata
            modelBuilder.AddMapping(new UserMetadataMap());

            // UserRoles
            modelBuilder.AddMapping(new UserRoleMap());

            base.ConfigureMappings(modelBuilder);
        }

        // TODO: May not need this used previously to add DeletedOn == null query filter
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            AddSoftDeletionFilter<Acl>(modelBuilder);
            AddSoftDeletionFilter<Job>(modelBuilder);
            AddSoftDeletionFilter<Role>(modelBuilder);
            AddSoftDeletionFilter<User>(modelBuilder);
            AddSoftDeletionFilter<UserLogin>(modelBuilder);
            AddSoftDeletionFilter<UserMetadata>(modelBuilder);
            AddSoftDeletionFilter<UserRole>(modelBuilder);

            base.OnModelCreating(modelBuilder);
        }

        #region Overrides of Context

        /// <summary>
        /// Generate the database structure by running the code-first migrations
        /// </summary>
        public override void CreateStructure() => Database.Migrate();

        /// <summary>
        /// Drops the configured database
        /// </summary>
        public override void DeleteDatabase() => Database.EnsureDeleted();

        /// <summary>
        /// Drop the database structure by reverting the code-first migrations
        /// </summary>
        public override void DropStructure()
        {
            var migrator = this.GetInfrastructure().GetRequiredService<IMigrator>();
            migrator.Migrate("0");
        }

        #endregion Overrides of Context

        #endregion Public Methods

        #region Private Methods

        private void AddSoftDeletionFilter<T>(ModelBuilder builder) where T : class
            => builder.Entity<T>().HasQueryFilter(GetSoftDeletionFilter<T>());

        private Expression<Func<T, bool>> GetSoftDeletionFilter<T>()
            => e => EF.Property<DateTimeOffset?>(e, "DeletedOn") == null;

        #endregion Private Methods
    }
}
