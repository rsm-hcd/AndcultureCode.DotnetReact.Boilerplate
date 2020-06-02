using System;
using Microsoft.AspNetCore.Mvc;
using AndcultureCode.GB.Presentation.Web.Filters.Authorization;

namespace AndcultureCode.GB.Presentation.Web.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class BasicAuthAttribute : TypeFilterAttribute
    {
        public BasicAuthAttribute(string realm = @"GB Realm") : base(typeof(BasicAuthFilter))
        {
            Arguments = new object[] { realm };
        }
    }
}