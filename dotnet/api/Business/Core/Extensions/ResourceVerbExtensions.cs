using System.Collections.Generic;
using AndcultureCode.GB.Business.Core.Models.Security;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    public static class ResourceVerbExtensions
    {
        public static ResourceVerb ToResourceVerb(this string resourceVerbString)
        {
            return new ResourceVerb(resourceVerbString);
        }

        public static List<ResourceVerb> ToResourceVerbs(this IEnumerable<string> resourceVerbStrings)
        {
            var list = new List<ResourceVerb>();
            foreach (var rv in resourceVerbStrings)
            {
                list.Add(rv.ToResourceVerb());
            }

            return list;
        }
    }
}