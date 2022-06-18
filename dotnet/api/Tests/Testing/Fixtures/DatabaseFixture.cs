using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using AndcultureCode.CSharp.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using Testing.Extensions;
using Respawn;
using AndcultureCode.CSharp.Core.Utilities.Configuration;
using AndcultureCode.CSharp.Core.Constants;
using Docker.DotNet;
using AndcultureCode.GB.Tests.Testing.Containers;
using System.Runtime.InteropServices;

namespace AndcultureCode.GB.Tests.Testing.Fixtures
{
    public abstract class DatabaseFixture : IDisposable
    {
        #region Constants

        private const int DELAY = 300000;

        #endregion Constants

        #region Properties

        private IConfigurationRoot _configuration { get; set; }
        public SqlConnectionStringBuilder Connection { get; set; }
        public IContext Context => new GBApiContext(connectionString: Connection.ConnectionString, loggerFactory: null);
        public bool DeleteDatabaseBetweenTests = false;
        private readonly DockerClient _dockerClient;
        private readonly SqlServerContainer _sqlServerContainer;

        #endregion Properties

        #region Setup

        /// <summary>
        /// // Note: If 'Connection' is resulting in 'null', you need to make sure the correct appSettings.json
        // is getting copied into your test project output. Verify you have the file being copied in your test
        // project's .csproj file correctly.
        /// </summary>
        /// <param name="collectionName"></param>
        protected DatabaseFixture(string collectionName, string portNumber)
        {
            Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", EnvironmentConstants.TESTING);
            _configuration = ConfigurationUtils.GetConfiguration();

            var dataSource = $"127.0.0.1,{portNumber}";
            Connection = new SqlConnectionStringBuilder
            {
                ConnectTimeout = 5,
                DataSource = dataSource,
                MultipleActiveResultSets = true,
                Password = "Passw0rd!",
                UserID = "sa"
            };

            var dockerClientUri = RuntimeInformation.IsOSPlatform(OSPlatform.Linux) ?
                new Uri("unix:///var/run/docker.sock") : new Uri("npipe://./pipe/docker_engine");
            _dockerClient = new DockerClientConfiguration(dockerClientUri).CreateClient();

            DockerContainerBase.CleanupOrphanedContainers(_dockerClient, collectionName).Wait(DELAY);

            _sqlServerContainer = new SqlServerContainer(
                connectionString: Connection.ConnectionString,
                port: portNumber,
                prefix: collectionName
            );
            _sqlServerContainer.Start(_dockerClient).Wait(DELAY);

            Connection.InitialCatalog = $"GBTest-{collectionName}";

            Console.WriteLine($"[DatabaseFixture] Test database name: {Connection.InitialCatalog}");
            Context.CreateStructure();

        }

        #endregion Setup

        #region Public Methods

        /// <summary>
        /// Retrieves and cleans data from all application database tables for the configured database.
        /// </summary>
        public void CleanDatabaseTables()
        {
            using (var sqlConnection = new SqlConnection(Connection.ToString()))
            {
                sqlConnection.Open();

                var checkpoint = new Checkpoint
                {
                    TablesToIgnore = new string[]
                    {
                        "__EFMigrationsHistory"
                    },
                };

                checkpoint.Reset(sqlConnection).GetAwaiter().GetResult();
            }
        }

        #endregion Public Methods

        #region Teardown

        public void Dispose()
        {
            Context.DeleteDatabase();
            Dispose(true);
        }

        private void Dispose(bool itIsSafeToAlsoFreeManagedObjects)
        {
            if (!itIsSafeToAlsoFreeManagedObjects)
            {
                return;
            }

            // remove containers
            _sqlServerContainer.Remove(_dockerClient).Wait(DELAY);
            _dockerClient.Dispose();
        }

        ~DatabaseFixture()
        {
            Dispose(false);
        }

        #endregion Teardown
    }
}
