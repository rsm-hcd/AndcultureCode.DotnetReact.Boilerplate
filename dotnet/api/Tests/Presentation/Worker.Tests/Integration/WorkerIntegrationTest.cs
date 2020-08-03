using System;
using System.Collections.Generic;
using System.Linq;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Interfaces.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Moq;
using AndcultureCode.GB.Business.Conductors.Extensions.Startup;
using AndcultureCode.GB.Business.Core.Interfaces.Data;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions;
using AndcultureCode.GB.Presentation.Worker.Extensions;
using AndcultureCode.GB.Testing.Tests;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit;
using Xunit.Abstractions;
using AndcultureCode.CSharp.Core.Utilities.Configuration;

namespace AndcultureCode.GB.Presentation.Worker.Tests.Integration
{
    [Collection("WorkerIntegration")]
    public class WorkerIntegrationTest<TSut> : ApiIntegrationTest, IDisposable
        where TSut : class
    {
        #region Member Variables

        protected static IConfigurationRoot cachedConfiguration;
        protected static IServiceCollection cachedServiceCollection;
        protected static IServiceProvider cachedServiceProvider;
        protected static int currentTestGetDepMethodInvocationCount = 0;
        protected static int currentTestMockMethodInvocationCount = 0;

        #endregion Member Variables

        protected IConfigurationRoot Configuration
        {
            get
            {
                if (cachedConfiguration != null)
                {
                    return cachedConfiguration;
                }

                var builder = new ConfigurationBuilder()
                    .SetBasePath(System.IO.Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .AddJsonFile($"appsettings.{EnvironmentName}.json", optional: true)
                    .AddEnvironmentVariables();

                cachedConfiguration = builder.Build();
                ConfigurationUtils.SetConfiguration(cachedConfiguration);
                ConfigurationUtils.GetConnectionString();

                return cachedConfiguration;
            }
        }

        private TSut _sut { get; set; }

        /// <summary>
        /// System Under Test (SUT)
        ///
        /// Term commonly used in .NET Testing Community to name
        /// the exact concrete implementation being _integration_ tested.
        ///
        /// Examples:
        /// - https://specsfor.readme.io/docs/the-system-under-test-sut
        /// - https://blogs.msdn.microsoft.com/ploeh/2008/10/06/naming-sut-test-variables/
        /// - https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-2.1
        /// </summary>
        protected TSut Sut { get => _sut = _sut ?? GetDep<TSut>(); }
        protected TSut sut { get => Sut; } // Provide compile-error if developers created local variables called 'sut'
        protected TSut SUT { get => Sut; } // Provide compile-error if developers created local variables called 'SUT'

        protected GBApiContext GBApiContext => (GBApiContext)Context;

        private IServiceCollection ServiceCollection
        {
            get => cachedServiceCollection = cachedServiceCollection ?? ConfigureDefaultDependencyInjector();
        }

        private IServiceProvider ServiceProvider
        {
            get => cachedServiceProvider = cachedServiceProvider ?? ServiceCollection.BuildServiceProvider();
        }

        /// <summary>
        /// Request dependency and all its sub-dependencies as they are registered in ServiceProvider dependency injection registry
        /// </summary>
        protected T GetDep<T>() where T : class
        {
            var instance = ServiceProvider.GetService(typeof(T)) as T;
            currentTestGetDepMethodInvocationCount++;
            return instance;
        }

        /// <summary>
        /// Replace the original entry for <T> and replace with mock object
        /// </summary>
        protected void RegisterDep<T>(T mockObject) where T : class
        {
            if (currentTestGetDepMethodInvocationCount > 0)
            {
                throw new InvalidOperationException("[WorkerIntegrationTest#Mock] You cannot call 'Register<T>()' after requesting an object from 'GetDep<T>()'");
            }

            _registerDep(ServiceCollection, mockObject);

            currentTestMockMethodInvocationCount++;
        }

        /// <summary>
        /// Replace the original entry for <T> and replace with mock
        /// </summary>
        protected void RegisterDep<T>(Mock<T> mock) where T : class => RegisterDep(mock.Object);


        /// <summary>
        /// Replace the original entry for <T> and replace with mock object
        /// </summary>
        private void _registerDep<T>(IServiceCollection services, T mockObject) where T : class
        {
            var existingDescriptor = services.FirstOrDefault(d => d.ServiceType == typeof(T));
            services.Remove(existingDescriptor);
            services.AddScoped((sp) => mockObject);
        }

        /// <summary>
        /// Replace the original entry for <T> and replace with mock object
        /// </summary>
        private void _registerDep<T>(IServiceCollection services, Mock<T> mockObject) where T : class
            => _registerDep(services, mockObject.Object);


        /// <summary>
        /// Configure dependency injected resources for controller tests
        /// This method is not to be cached.
        /// </summary>
        /// <returns></returns>
        private IServiceCollection ConfigureDefaultDependencyInjector()
        {
            var services = new ServiceCollection();

            ConfigureContexts(services);

            services
                .AddSqlServer()
                .AddConductors(Configuration)
                .AddWorkers();

            ConfigureMvcActors(services);

            return services;
        }

        private IServiceCollection ConfigureContexts(IServiceCollection services)
        {
            services.AddDbContext<GBApiContext>(ServiceLifetime.Scoped);
            services.AddScoped((sp) => GBApiContext);
            services.AddScoped<GBApiContext>((sp) => GBApiContext);
            services.AddScoped<IContext>((sp) => GBApiContext);
            services.AddScoped<IGBApiContext>((sp) => GBApiContext);

            return services;
        }

        private IServiceCollection ConfigureMvcActors(IServiceCollection services)
        {
            var hostingEnvironmentMock = new Mock<IHostEnvironment>();
            services.AddScoped<IHostEnvironment>((sp) => hostingEnvironmentMock.Object);
            return services;
        }

        #region Constructor

        public WorkerIntegrationTest(
            ITestOutputHelper output,
            DatabaseFixture fixture
        ) : base(output, fixture.Context)
        {
            // If the previous test did not 'mock' anything, lets not
            // unnecessarily clear the previously configured ServiceCollection
            // being it is more expensive and redundant when no changes were made.
            if (currentTestMockMethodInvocationCount > 0)
            {
                cachedServiceCollection = null;
            }
            cachedServiceProvider = null;

            // Reset per test method counters
            currentTestGetDepMethodInvocationCount = 0;
            currentTestMockMethodInvocationCount = 0;

            // Flush database
            fixture.CleanDatabaseTables();

            ServiceCollection.AddScoped(typeof(TSut), typeof(TSut));
        }

        #endregion Constructor

        #region Phase: Assert

        /// <summary>
        /// Clears cached data in the underlying DataContext for the supplied entity.
        /// </summary>
        /// <param name="entity"></param>
        protected void Reload(IEntity entity) => GBApiContext.Entry(entity).Reload();

        protected void Reload(IEnumerable<IEntity> entities)
        {
            foreach (var entity in entities)
            {
                GBApiContext.Entry(entity).Reload();
            }
        }

        #endregion Phase: Assert


        #region Teardown

        public override void Dispose()
        {
            base.Dispose();
        }

        #endregion Teardown
    }
}
