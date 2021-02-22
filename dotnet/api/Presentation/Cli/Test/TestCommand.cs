using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AndcultureCode.GB.Presentation.Cli.Test.Database;

namespace AndcultureCode.GB.Presentation.Cli.Test
{
    public class TestCommand : Command
    {
        #region Protected Properties

        protected override string _commandDescription => "Top level command for managing dotnet project automated tests";

        #endregion Protected Properties


        #region Constructor

        public TestCommand(
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
            _command.Command("database", cmd => new TestDatabaseCommand(cmd, _configurationRoot, _serviceCollection));
            _command.Command("db", cmd => new TestDatabaseCommand(cmd, _configurationRoot, _serviceCollection));
        }

        #endregion Private Methods
    }
}