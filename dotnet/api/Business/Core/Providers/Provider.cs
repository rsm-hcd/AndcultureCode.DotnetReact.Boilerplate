using System.Text.RegularExpressions;

namespace AndcultureCode.GB.Business.Core.Providers
{
    public abstract class Provider
    {
        #region Properties

        /// <summary>
        /// Specify whether the provider has been implemented
        /// </summary>
        public virtual bool Implemented => false;

        /// <summary>
        /// Name of the provider
        /// </summary>
        public virtual string Name => Regex.Replace(GetType().Name, "([A-Z])", " $1", RegexOptions.Compiled).Trim();

        #endregion
    }
}
