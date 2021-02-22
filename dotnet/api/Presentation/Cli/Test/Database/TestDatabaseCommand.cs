using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AndcultureCode.GB.Presentation.Cli.Test.Database
{
    public class TestDatabaseCommand : Command
    {
        #region Protected Properties

        protected override string _commandDescription => "Top level command for managing dotnet project automated test database(s)";

        #endregion Protected Properties


        #region Constructor

        public TestDatabaseCommand(
            CommandLineApplication command,
            IConfigurationRoot configurationRoot,
            IServiceCollection serviceCollection
        ) : base(command, configurationRoot, serviceCollection)
        {
        }

        #endregion Constructor


        #region Protected Methods

        protected override void RegisterSubCommands()
        {
            // _command.Command("delete",  cmd => new TestDatabaseDeleteCommand (cmd, _configurationRoot, _serviceCollection));
            // _command.Command("drop",    cmd => new TestDatabaseDeleteCommand (cmd, _configurationRoot, _serviceCollection));
            _command.Command("migrate", cmd => new TestDatabaseMigrateCommand(cmd, _configurationRoot, _serviceCollection));
        }

        #endregion Protected Methods
    }
}