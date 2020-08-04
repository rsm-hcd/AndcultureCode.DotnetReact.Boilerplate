namespace Testing.Constants
{
    /// <summary>
    /// Testing categories
    /// </summary>
    public class Category
    {
        #region Names

        /// <summary>
        /// Should this test be skipped on continuous integration executions of the test suite?
        /// Value options: true|false
        /// </summary>
        public const string SKIP_CI = "SkipCI";

        #endregion Names

        #region Values

        public const string VALUE_FALSE = "false";
        public const string VALUE_TRUE = "true";

        #endregion Values
    }
}
