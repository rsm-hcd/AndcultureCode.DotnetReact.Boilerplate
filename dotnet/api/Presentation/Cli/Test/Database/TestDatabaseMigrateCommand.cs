using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Testing.Extensions;

namespace AndcultureCode.GB.Presentation.Cli.Test.Database
{
    public class TestDatabaseMigrateCommand : Command
    {
        #region Protected Properties

        protected override string _commandDescription => "Re-migrates the dotnet test database. Will create the database if it does not exist.";

        #endregion Protected Properties


        #region Constructor

        public TestDatabaseMigrateCommand(
            CommandLineApplication command,
            IConfigurationRoot configurationRoot,
            IServiceCollection serviceCollection
        ) : base(command, configurationRoot, serviceCollection)
        {
        }

        #endregion Constructor


        #region Protected Methods

        public override int OnExecute()
        {
            Output($"Migrating test database '{_configurationRoot.GetTestDatabaseName()}'...");

            MakeNewContextsUseTestDatabase();
            _testDatabaseContext.CreateStructure();

            Output(" - Successfully migrated test database.");
            return SUCCESSFUL;
        }

        #endregion Protected Methods
    }
}