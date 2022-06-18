using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Docker.DotNet.Models;

namespace AndcultureCode.GB.Tests.Testing.Containers
{
    public class SqlServerContainer : DockerContainerBase
    {
        #region Constants

        private const string IMAGE_NAME = "mcr.microsoft.com/mssql/server";
        private const string TAG_NAME = "2019-latest";

        #endregion Constants

        #region Member Variables

        private readonly string ConnectionString;
        private readonly string PortNumber;

        #endregion Member Variables

        #region Constructor

        public SqlServerContainer(string connectionString, string port, string prefix)
        : base(
            imageName: IMAGE_NAME,
            containerName: $"{prefix}{Guid.NewGuid().ToString()}",
            tagName: TAG_NAME
        )
        {
            ConnectionString = connectionString;
            PortNumber = port;
        }

        #endregion Constructor

        #region Overrides

        protected async override Task<bool> IsReady()
        {
            try
            {
                using (var conn = new SqlConnection(ConnectionString))
                {
                    await conn.OpenAsync();
                    return true;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        protected override Config ToConfig()
        {
            return new Config
            {
                Env = new List<string> { "ACCEPT_EULA=Y", "SA_PASSWORD=Passw0rd!", "MSSQL_PID=Developer" }
            };
        }

        protected override HostConfig ToHostConfig()
        {
            return new HostConfig
            {
                PortBindings = new Dictionary<string, IList<PortBinding>>
                {
                    {
                        "1433/tcp",
                        new List<PortBinding>
                        {
                            new PortBinding
                            {
                                HostPort = PortNumber,
                                HostIP = "127.0.0.1"
                            }
                        }
                    }
                }
            };
        }

        #endregion Overrides
    }
}