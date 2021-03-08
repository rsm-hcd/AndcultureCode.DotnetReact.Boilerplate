using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using AndcultureCode.CSharp.Core.Interfaces.Entity;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using AndcultureCode.GB.Business.Conductors.Extensions.Startup;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Infrastructure.Data.SqlServer;
using AndcultureCode.GB.Infrastructure.Data.SqlServer.Extensions;
using AndcultureCode.GB.Presentation.Web.Controllers.Api.V1;
using AndcultureCode.GB.Presentation.Web.Extensions.Startup;
using AndcultureCode.GB.Presentation.Web.Models;
using AndcultureCode.GB.Presentation.Worker.Extensions;
using AndcultureCode.GB.Testing.Tests;
using AndcultureCode.GB.Tests.Testing.Fixtures;
using Xunit.Abstractions;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Hosting;
using AndcultureCode.CSharp.Core.Utilities.Localization;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Constants;
using AndcultureCode.CSharp.Core.Utilities.Configuration;
using AndcultureCode.CSharp.Core.Interfaces.Providers.Worker;
using AndcultureCode.CSharp.Web.Extensions;
using System.Data.SqlClient;

namespace AndcultureCode.GB.Tests.Presentation.Web.Tests.Integration.Controllers
{
    /// <summary>
    /// Arrange Phase
    /// There are key steps for arrangement of (1) Registering and (1) Requesting Dependencies.
    /// Registration must happen before your first 'request' (ie. GetDep<T>()). After your first GetDep<T>() call
    /// requests to 'RegisterDep' will throw an exception.
    /// </summary>
    public class ControllerTest<TController> : ApiIntegrationTest, IDisposable
        where TController : ApiController
    {
        #region Member Variables

        protected static IConfigurationRoot cachedConfiguration;
        protected static IServiceCollection cachedServiceCollection;
        protected static IServiceProvider cachedServiceProvider;
        protected static int currentTestGetDepMethodInvocationCount = 0;
        protected static int currentTestMockMethodInvocationCount = 0;

        #endregion Member Variables

        #region Member Variables: Shared between tests

        private static Mapper _cachedMapper;

        #endregion Member Variables: Shared between tests

        #region Member Variables: Unique to each test

        // protected Role               AuthenticatedRole { get; set; }
        // protected User               AuthenticatedUser { get; set; }

        /// <summary>
        /// When set to 'true' in your given test fixture, will output additional
        /// debugging information around the test framework
        /// </summary>
        /// <value></value>
        protected bool DebugTestFramework { get; set; }
        private DatabaseFixture _fixture { get; set; }
        protected GBApiContext GBApiContext => (GBApiContext)Context;

        protected override IMapper Mapper
        {
            get => _cachedMapper = _cachedMapper ?? BuildDefaultMapper();
        }

        private IServiceCollection ServiceCollection
        {
            get => cachedServiceCollection = cachedServiceCollection ?? ConfigureDefaultDependencyInjector();
        }

        private IServiceProvider ServiceProvider
        {
            get
            {
                if (cachedServiceProvider == null)
                {
                    var collection = ServiceCollection; // Force it to cache initially, before timing
                    var watch = Stopwatch.StartNew();
                    cachedServiceProvider = collection.BuildServiceProvider(); // Note: Last Performance Test: ~0.000115 ms / ~100 ns
                    watch.Stop();
                    LogIfDebugging($"[ServiceProvider#Get] Time to build: " + watch.Elapsed);
                }
                return cachedServiceProvider;
            }
        }

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

        private TController _sut { get; set; }

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
        protected TController Sut { get => _sut = _sut ?? GetDep<TController>(); }
        protected TController sut { get => Sut; } // Provide compile-error if developers created local variables called 'sut'
        protected TController SUT { get => Sut; } // Provide compile-error if developers created local variables called 'SUT'

        #endregion Member Variables: Unique to each test


        #region Setup

        /// <summary>
        /// Static constructor to set up suite-level actors
        /// </summary>
        static ControllerTest()
        {
            LoadFactories(typeof(ControllerTest<>).GetTypeInfo().Assembly);
            LoadFactories(typeof(ApiIntegrationTest).GetTypeInfo().Assembly);
        }

        /// <summary>
        /// Instance constructor to set up common test-level actors
        /// </summary>
        public ControllerTest(
            DatabaseFixture fixture,
            ITestOutputHelper output
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
            // TODO: consider detecting if the developer actually made changes between
            // tests and skip if no changes were actually made.
            _fixture = fixture;
            _fixture.CleanDatabaseTables();

            SetDefaultEnvironmentVariables(_fixture.Connection);

            // Register SUT/Controller being they aren't in DI by default
            ServiceCollection.AddScoped(typeof(TController), typeof(TController));
        }

        #endregion Setup


        #region Teardown

        public override void Dispose()
        {
            base.Dispose();
        }

        #endregion


        #region Protected Methods

        #region General

        protected void LogIfDebugging(string message)
        {
            if (!DebugTestFramework)
            {
                return;
            }

            Console.WriteLine(message);
        }

        #endregion General

        #region Phase: Arrange

        #region Dependency Management

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
                throw new InvalidOperationException("[ControllerTest#Mock] You cannot call 'Register<T>()' after requesting an object from 'GetDep<T>()'");
            }

            _registerDep(ServiceCollection, mockObject);

            currentTestMockMethodInvocationCount++;
        }

        /// <summary>
        /// Replace the original entry for <T> and replace with mock
        /// </summary>
        protected void RegisterDep<T>(Mock<T> mock) where T : class => RegisterDep(mock.Object);

        #endregion Dependency Management

        #region Mocking OnActionExecuting

        protected Mock<ActionExecutingContext> GetMockActionExecutingContext()
            => GetMockActionExecutingContext(routeDataPairs: null);

        /// <summary>
        /// When testing controllers with OnActionExecuting, you'll need to commonly
        /// mock portions of the ActionExecutingContext. This provides ways
        /// to provide the various aspects on a convenient way.
        /// </summary>
        /// <param name="routeData"></param>
        /// <returns></returns>
        protected Mock<ActionExecutingContext> GetMockActionExecutingContext(params (string Key, object Value)[] routeDataPairs)
        {
            RouteData routeData = new Mock<RouteData>().Object;
            if (routeDataPairs != null)
            {
                routeData = new RouteData();
                foreach (var pair in routeDataPairs)
                {
                    routeData.Values.Add(pair.Key, pair.Value);
                }
            }

            var ctlActionDescriptor = new ControllerActionDescriptor
            {
                ControllerName = "ControllerName"
            };


            var actionContext = new ActionContext(
                new Mock<HttpContext>().Object,
                routeData,
                ctlActionDescriptor,
                new Mock<ModelStateDictionary>().Object
            );

            var controllerContext = new ControllerContext(actionContext);

            var actionExecutingContext = new Mock<ActionExecutingContext>(
                controllerContext,
                new List<IFilterMetadata>(),
                new Dictionary<string, object>(),
                new Mock<AndcultureCode.CSharp.Web.Controllers.Controller>()
            );

            Sut.ControllerContext = controllerContext;

            // For whatever reason, these don't actually get set after the constructor is called, so mock their return values.
            actionExecutingContext.Setup(e => e.ActionArguments).Returns(routeDataPairs?.ToDictionary(e => e.Key, e => e.Value) ?? new Dictionary<string, object>());
            actionExecutingContext.Setup(e => e.Controller).Returns(Sut);
            actionExecutingContext.Setup(e => e.Filters).Returns(new List<IFilterMetadata>());

            return actionExecutingContext;
        }

        #endregion Mocking OnActionExecuting

        #region MockAuthenticatedUser

        protected User AuthenticatedUser { get; set; }

        protected User MockAuthenticatedUser(User user = null)
        {
            if (user == null)
            {
                user = Create<User>(e => e.Id = 0);
            }

            AuthenticatedUser = user;
            SetSutClaimsPrincipal(AuthenticatedUser);

            return user;
        }

        protected User MockAuthenticatedUser() => MockAuthenticatedUser(null);

        protected User MockAuthenticatedUser(User user = null, UserLogin userLogin = null)
        {
            if (user == null)
            {
                user = Create<User>(e => e.Id = 0);
            }

            AuthenticatedUser = user;
            SetSutClaimsPrincipal(AuthenticatedUser, userLogin);

            return user;
        }

        /// <summary>
        /// Sets the current assigned Sut with the provided User and Role as the current authenticated user
        /// </summary>
        /// <param name="user"></param>
        /// <param name="role"></param>
        protected void SetSutClaimsPrincipal(User user)
        {
            if (Sut == null)
            {
                throw new InvalidOperationException("[ControllerTest] Sut MUST be set");
            }

            Sut.ApiClaimsPrincipal = new ApiClaimsPrincipal
            {
                IsSuperAdmin = user != null ? user.IsSuperAdmin : false,
                UserId = user.Id
            };
        }

        /// <summary>
        /// Sets the current assigned Sut with the provided User and Role as the current authenticated user
        /// </summary>
        /// <param name="user"></param>
        /// <param name="userLogin"></param>
        protected void SetSutClaimsPrincipal(User user, UserLogin userLogin)
        {
            if (Sut == null)
            {
                throw new InvalidOperationException("[ControllerTest] Sut MUST be set");
            }

            Sut.ApiClaimsPrincipal = new ApiClaimsPrincipal
            {
                IsSuperAdmin = user != null ? user.IsSuperAdmin : false,
                RoleId = userLogin?.RoleId,
                UserId = user?.Id,
                UserLoginId = userLogin?.Id
            };
        }

        #endregion MockAuthenticatedUser

        #region MockCulture

        protected ICulture MockCulture(string cultureCode = null)
        {
            if (cultureCode == null)
            {
                cultureCode = LocalizationUtils.DefaultCultureCode;
            }

            return SetSutCulture(cultureCode);
        }

        protected ICulture SetSutCulture(string cultureCode)
        {
            var culture = LocalizationUtils.CultureByCode(cultureCode);
            if (culture == null)
            {
                throw new Exception($"[ControllerTest#SetSutCulture] Invalid culture code '{cultureCode}'");
            }

            Sut.ApiCulture = culture;

            return culture;
        }

        #endregion MockCulture

        #region GetAuthenticatedUser



        #endregion


        #endregion Phase: Arrange


        #region Phase: Act

        protected Mock<ActionExecutingContext> ActOnActionExecuting()
            => ActOnActionExecuting(routeDataPairs: null);

        protected Mock<ActionExecutingContext> ActOnActionExecuting(params (string Key, object Value)[] routeDataPairs)
        {
            var mock = GetMockActionExecutingContext(routeDataPairs);
            Sut.OnActionExecuting(mock.Object);
            return mock;
        }

        #endregion Phase: Act


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

        #endregion Protected Methods


        #region Private Methods

        #region Phase: Arrange

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

        #endregion Phase: Arrange

        #region Phase: Assert

        /// <summary>
        /// Configure dependency injected resources for controller tests
        /// This method is not to be cached.
        /// </summary>
        /// <returns></returns>
        private IServiceCollection ConfigureDefaultDependencyInjector()
        {
            // Note: Last Performance Test: ~0.682 ms
            var watch = Stopwatch.StartNew();

            var services = new ServiceCollection();

            // Base ASPNET provided actors
            ConfigureMvcActors(services);

            services
                .AddLogging()
                .AddAutoMapper(typeof(MappingProfile))
                .AddConfiguration(Configuration, "does-not-matter-for-tests", EnvironmentName)
                .AddContexts(Configuration, EnvironmentName)
                .AddSqlServer()
                .AddClients(Configuration)
                .AddConductors(Configuration)
                .AddAndcultureCodeLocalization()
                .AddWorkers()
                .AddClients(Configuration)
                .AddProviders();

            services.AddCookieAuthentication(Configuration);


            // Additional Project Dependencies
            //.AddDistributedRedisCache(configuration); Note: We don't want to configure distribute redis cache until we absolutely need to

            ConfigureHttpContextAccessor(services);
            ConfigureMockedBackgroundWorkerProvider(services);
            ConfigureMockLinkGenerator(services);

            watch.Stop();
            LogIfDebugging("[ConfigureDefaultDependencyInjector] Time to build IServiceCollection: " + watch.Elapsed);

            return services;
        }

        private IServiceCollection ConfigureHttpContextAccessor(IServiceCollection services)
        {
            var authServiceMock = new Mock<IAuthenticationService>();
            authServiceMock
                .Setup(m => m.SignInAsync(
                    It.IsAny<HttpContext>(),
                    It.IsAny<string>(),
                    It.IsAny<ClaimsPrincipal>(),
                    It.IsAny<AuthenticationProperties>()))
                .Returns(Task.FromResult((object)null));
            authServiceMock
                .Setup(m => m.SignOutAsync(
                    It.IsAny<HttpContext>(),
                    It.IsAny<string>(),
                    It.IsAny<AuthenticationProperties>()))
                .Returns(Task.FromResult(true));

            var serviceProviderMock = new Mock<IServiceProvider>();
            serviceProviderMock
                .Setup(m => m.GetService(typeof(IAuthenticationService)))
                .Returns(authServiceMock.Object);

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.SetupGet(
                e => e.RequestServices
            ).Returns(serviceProviderMock.Object);

            var httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            httpContextAccessorMock
                .Setup(e => e.HttpContext)
                .Returns(httpContextMock.Object);

            httpContextAccessorMock
                .SetupGet(m => m.HttpContext.Connection.RemoteIpAddress).Returns(IPAddress.Parse("127.0.0.1"));

            _registerDep(services, httpContextAccessorMock);

            return services;
        }

        /// <summary>
        /// We don't want to interact with SQL Server for the majority of integration tests. By default we will mock and return success objects.
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        private IServiceCollection ConfigureMockedBackgroundWorkerProvider(IServiceCollection services)
        {
            var mockWorkerProvider = new Mock<IWorkerProvider>();

            mockWorkerProvider.Setup(e => e.Delete(It.IsAny<string>())).Returns(true);
            mockWorkerProvider.Setup(e => e.DeletedCount()).Returns(0);
            mockWorkerProvider.Setup(e => e.Enqueue(It.IsAny<Expression<Action>>())).Returns(Guid.NewGuid().ToString());
            mockWorkerProvider.Setup(e => e.Implemented).Returns(true);

            services.AddScoped<IWorkerProvider>((sp) => mockWorkerProvider.Object);

            return services;
        }

        private IServiceCollection ConfigureMockLinkGenerator(IServiceCollection services)
        {
            var mockLinkGenerator = new Mock<LinkGenerator>();
            mockLinkGenerator.Setup(x => x.GetUriByAddress<RouteValuesAddress>(
                It.IsAny<HttpContext>(),
                It.IsAny<RouteValuesAddress>(),
                It.IsAny<RouteValueDictionary>(),
                It.IsAny<RouteValueDictionary>(),
                It.IsAny<string>(),
                It.IsAny<HostString?>(),
                It.IsAny<PathString?>(),
                It.IsAny<FragmentString>(),
                It.IsAny<LinkOptions>())).Returns("/");

            _registerDep(services, mockLinkGenerator.Object);

            return services;
        }

        private IServiceCollection ConfigureMvcActors(IServiceCollection services)
        {
            var hostingEnvironmentMock = new Mock<IWebHostEnvironment>();

            services.AddScoped<IWebHostEnvironment>((sp) => hostingEnvironmentMock.Object);

            return services;
        }
        private Mapper BuildDefaultMapper() => new Mapper(new MapperConfiguration(config =>
        {
            config.AddProfile(new MappingProfile());
        }));


        /// <summary>
        /// Set shared testing related environment variables used across ALL controller integration tests
        /// </summary>
        private void SetDefaultEnvironmentVariables(SqlConnectionStringBuilder connection)
        {
            Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", EnvironmentConstants.TESTING);
            Environment.SetEnvironmentVariable($"ConnectionStrings__{ApplicationConstants.API_DATABASE_CONFIGURATION_KEY}", connection.ConnectionString);
            // Environment.SetEnvironmentVariable("Workers.Hangfire__isDashboardEnabled", "false");
            // Environment.SetEnvironmentVariable("Workers.Hangfire__isServerEnabled",    "false");
        }

        #endregion Phase: Assert

        #region Entity Seed Methods

        /*\
        ------------------------------------------------------------------------------------------------------
        About Seed Methods
        ------------------------------------------------------------------------------------------------------
        Do NOT add custom flags to handle different scenarios in these methods.
        Basically have each method defer to factories, forwarding property lists from their signatures.
        These methods should just provide the glue to setup a given object and it's dependencies.

        For example, if you need a Entity with an underlying virtual child property that requires configuration
        beyond the defaults provided by the Child's factory, do NOT add a paramater to forward the child's properties
        through the 'SeedEntity' method. This is a VERY slippery slope of coupling and hard
        to maintain test setup. Instead, set that up manually in your test setup.

        These seed methods should remain convenient ONLY for the tests where you just need a type of "thing"
        and don't care very much about the details.
        ------------------------------------------------------------------------------------------------------
        \*/

        #endregion Entity Seed Methods

        #endregion Private Methods
    }
}
