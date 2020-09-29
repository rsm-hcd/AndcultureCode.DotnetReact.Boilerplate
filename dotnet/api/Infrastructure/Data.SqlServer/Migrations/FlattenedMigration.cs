using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Migrations
{
    public partial class FlattenedMigration : Migration
    {
        public const string InitialMigrationId = "20200603183650_InitialCreate";

        public static readonly List<string> FlattenedMigrations = new List<string> {
            InitialMigrationId
        };

        #region Private

        GBApiContext _context;

        #endregion Private

        #region Overrides

        protected override void Up(MigrationBuilder migrationBuilder)
        {
        }

        #endregion Overrides

        public GBApiContext Context
        {
            get
            {
                if (this._context == null)
                {
                    this._context = new GBApiContext();
                }

                return _context;
            }
        }

        public bool ValidateFlattenedShouldRun(string id)
        {
            int count = 0;
            using (var connection = Context.Database.GetDbConnection())
            {
                connection.Open();

                using (var command = connection.CreateCommand())
                {
                    command.CommandText = $"SELECT COUNT(*) FROM [dbo].[__EFMigrationsHistory]";
                    string result = command.ExecuteScalar().ToString();

                    int.TryParse(result, out count);
                }
            }

            // If we have migrations after this one (this isn't a new DB), then abandon ship.
            var migrationPosition = FlattenedMigrations.OrderBy(e => e).ToList().FindIndex(0, e => e == id);
            if (count > migrationPosition)
            {
                return false;
            }

            return true;
        }

        public void LogMigrationMessage(params string[] messages)
        {
            LogMigrationMessageLine("");
            LogMigrationMessageLine("------------------------------------------------");
            foreach (var m in messages)
            {
                LogMigrationMessageLine(m);
            }
            LogMigrationMessageLine("------------------------------------------------");
            LogMigrationMessageLine("");
        }

        public void LogMigrationMessageLine(string line, string direction = "Up")
        {
            var migrationName = this.GetType().Name;
            Console.WriteLine($"[Migration::{migrationName}#{direction}] {line}");
        }
    }
}
