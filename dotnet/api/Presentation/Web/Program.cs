using System.IO;
using AndcultureCode.CSharp.Core.Utilities.Hosting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;
using AndcultureCode.CSharp.Core.Providers.Configuration;

namespace AndcultureCode.GB.Presentation.Web
{
    public class Program
    {
        #region Public Properties

        public static IConfiguration Configuration => new LocalConfigurationProvider().GetConfiguration();

        #endregion Public Properties

        #region Public Methods

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            AndcultureCodeWebHost
                .Preload(args)
                .CreateDefaultBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseSerilog();

        public static void Main(string[] args)
            => CreateWebHostBuilder(args).Build().Run();

        #endregion Public Methods
    }
}
