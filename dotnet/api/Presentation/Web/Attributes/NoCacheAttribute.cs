using System;
using Microsoft.AspNetCore.Mvc;

namespace AndcultureCode.GB.Presentation.Web.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class NoCacheAttribute : ResponseCacheAttribute
    {
        #region Constructor

        /// <summary>
        /// Construct a ResponseCache for no caching
        /// </summary>
        public NoCacheAttribute()
        {
            Duration = 0;
            NoStore = true;
            Location = ResponseCacheLocation.None;
        }

        #endregion Constructor
    }
}

