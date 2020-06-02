using System.IO;
using AndcultureCode.CSharp.Core.Utilities.Hosting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using AndcultureCode.GB.Business.Core.Providers.Configuration;
using Serilog;

namespace AndcultureCode.GB.Presentation.Web
{
    public class Program
    {
        #region Public Properties

        public static IConfiguration Configuration => new LocalConfigurationProvider().GetConfiguration();

        #endregion Public Properties

        #region Public Methods

        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            AndcultureCodeWebHost
                .Preload(args)
                .CreateDefaultBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseSerilog();

        #endregion Public Methods

    }
}
