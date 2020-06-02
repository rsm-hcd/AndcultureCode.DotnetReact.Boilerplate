namespace AndcultureCode.GB.Business.Core.Interfaces.Providers
{
    public interface IProvider
    {
        #region Properties

        /// <summary>
        /// Specify whether the provider has been implemented
        /// </summary>
        bool Implemented { get; }

        /// <summary>
        /// Name of the provider
        /// </summary>
        string Name { get; }

        #endregion
    }
}
