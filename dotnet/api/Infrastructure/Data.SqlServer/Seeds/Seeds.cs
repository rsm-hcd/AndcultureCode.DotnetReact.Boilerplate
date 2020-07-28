using Microsoft.Extensions.Logging;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Seeds
{
    public class Seeds
    {
        #region Properties

        public GBApiContext Context { get; private set; }
        public bool IsDevelopment { get; private set; }
        public ILogger Logger { get; private set; }

        #endregion Properties

        #region Constructor

        public Seeds(ILogger logger, GBApiContext context, bool isDevelopment = false)
        {
            Context = context;
            IsDevelopment = isDevelopment;
            Logger = logger;
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

        #endregion Public Methods

        #region Private Methods

        /// <summary>
        /// Seed data that is required for the application to run, regardless of the environment
        /// </summary>
        private void CreateBase()
        {

        }

        /// <summary>
        /// Seed data that is only for development environments (ie. test accounts, use cases)
        /// </summary>
        private void CreateDevelopment()
        {

        }

        #endregion Private Methods
    }
}
