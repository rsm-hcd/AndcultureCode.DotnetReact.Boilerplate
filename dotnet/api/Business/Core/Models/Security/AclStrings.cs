using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace AndcultureCode.GB.Business.Core.Models.Security
{
    public class AclStrings
    {
        #region TestResource

        public const string TESTRESOURCE_READ = "TESTRESOURCE_READ";

        #endregion TestResource

        #region Jobs

        public const string JOBS_CREATE = "JOBS_CREATE";

        #endregion Jobs

        #region Roles

        public const string ROLE_CREATE = "ROLE_CREATE";
        public const string ROLE_DELETE = "ROLE_DELETE";
        public const string ROLE_READ = "ROLE_READ";
        public const string ROLE_UPDATE = "ROLE_UPDATE";

        #endregion Roles

        #region Users

        public const string USERS_DELETE = "USERS_DELETE";
        public const string USERS_READ = "USERS_READ";
        public const string USERS_UPDATE = "USERS_UPDATE";

        #endregion Users

        #region UserLogins

        public const string USERLOGINS_DELETE = "USERLOGINS_DELETE";
        public const string USERLOGINS_READ = "USERLOGINS_READ";
        public const string USERLOGINS_UPDATE = "USERLOGINS_UPDATE";

        #endregion UserLogins

        #region UserRoles

        public const string USERROLES_CREATE = "USERROLES_CREATE";
        public const string USERROLES_READ = "USERROLES_READ";
        public const string USERROLES_UPDATE = "USERROLES_UPDATE";

        #endregion UserRoles

        #region Public Methods

        public static List<string> GetAclStrings() => GetAclStringPairs().Select(e => e.Value).ToList();

        public static Dictionary<string, string> GetAclStringPairs()
        {
            var acls = new Dictionary<string, string>();

            var consts = typeof(AclStrings).GetTypeInfo().GetFields(
                BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy);

            foreach (var c in consts)
            {
                if (c.IsLiteral && !c.IsInitOnly)
                {
                    acls.Add(c.Name, (string)c.GetValue(null));
                }
            }

            return acls;
        }

        /// <summary>
        /// Retrieves all Acl Strings, case-insensitively, starting with a specific prefix
        /// </summary>
        /// <param name="prefix"></param>
        /// <returns></returns>
        public static List<string> GetAclStringsByPrefix(string prefix)
        {
            if (string.IsNullOrWhiteSpace(prefix))
            {
                return new List<string>();
            }

            prefix = prefix.ToLower();

            return GetAclStrings().Where(e => e.ToLower().StartsWith(prefix)).ToList();
        }

        #endregion Public Methods

    }
}
