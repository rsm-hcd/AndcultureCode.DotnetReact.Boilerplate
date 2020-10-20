using AndcultureCode.CSharp.Core.Constants;
using AndcultureCode.CSharp.Core.Utilities.Configuration;
using AndcultureCode.CSharp.Data.SqlServer.Migrations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Migrations
{
    public partial class GBFlattenedMigration : FlattenedMigration
    {
        #region Public Properties

        public const string InitialMigrationId = "20200603183650_InitialCreate";

        // This should contain all migration ID consts listed above, in the order that they should
        // be run.
        public static readonly List<string> _flattenedMigrations = new List<string> {
            InitialMigrationId
        };

        #endregion Public Properties

        #region Private Properties

        GBApiContext _context;

        #endregion Private Properties

        #region Overrides

        protected override void Up(MigrationBuilder migrationBuilder)
        {
        }

        public override List<string> FlattenedMigrations => _flattenedMigrations;

        public override DbContext Context => _context ??= new GBApiContext();

        #endregion Overrides
    }
}
