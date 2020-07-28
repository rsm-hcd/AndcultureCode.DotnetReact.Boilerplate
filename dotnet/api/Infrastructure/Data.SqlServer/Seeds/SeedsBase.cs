using System;
using Microsoft.Extensions.Logging;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Seeds
{
    /// <summary>
    /// TODO: Ultimately abstract to AndcultureCode.CSharp.Core or .Infrastructure.Data package
    /// </summary>
    public abstract class SeedsBase
    {
        #region Properties

        public GBApiContext Context { get; private set; }
        public bool IsDevelopment { get; private set; }
        public ILogger<Seeds> Logger { get; private set; }
        public IServiceProvider ServiceProvider { get; private set; }

        #endregion Properties

        #region Constructor

        public SeedsBase(IServiceProvider serviceProvider, bool isDevelopment = false)
        {
            IsDevelopment = isDevelopment;
            ServiceProvider = serviceProvider;

            Context = GetDep<GBApiContext>();
            Logger = GetDep<ILogger<Seeds>>();
        }

        #endregion Constructor

        #region Public Methods

        /// <summary>
        /// Primary entry point to initialize seed data
        /// </summary>
        public void Create()
        {
            CreateBase();

            if (IsDevelopment)
            {
                CreateDevelopment();
            }
        }

        /// <summary>
        /// Retrieve dependency from registry
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public T GetDep<T>() where T : class => ServiceProvider.GetService(typeof(T)) as T;

        /// <summary>
        /// Signify completion of seeding a particular type
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public void LogEnd<T>() where T : class => Logger.LogInformation($"Finished seeding `{typeof(T).Name}`");

        /// <summary>
        /// Signify start to seeding a particular type
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public void LogStart<T>() where T : class => Logger.LogInformation($"Seeding `{typeof(T).Name}`");

        #endregion Public Methods

        #region Protected Methods

        /// <summary>
        /// Seed data that is required for the application to run, regardless of the environment
        /// </summary>
        protected abstract void CreateBase();

        /// <summary>
        /// Seed data that is only for development environments (ie. test accounts, use cases)
        /// </summary>
        protected abstract void CreateDevelopment();

        #endregion Protected Methods
    }
}
