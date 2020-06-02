using System;

namespace AndcultureCode.GB.Business.Core.Models.Security
{
    public struct ResourceVerb
    {
        public string Resource { get; set; }
        public string Verb { get; set; }

        #region Constructor

        public ResourceVerb(string resource, string verb)
        {
            Resource = resource;
            Verb = verb;
        }

        public ResourceVerb(string resourceVerb)
        {
            var lastIndex = resourceVerb.LastIndexOf("_", StringComparison.CurrentCultureIgnoreCase);

            if (lastIndex == -1)
            {
                throw new ArgumentException($"{nameof(resourceVerb)} must contain at least one underscore");
            }

            Resource = resourceVerb.Substring(0, lastIndex);
            Verb = resourceVerb.Substring(lastIndex + 1);
        }

        #endregion

        #region Public Methods

        public override string ToString()
        {
            return $"{Resource}_{Verb}";
        }

        #endregion
    }
}