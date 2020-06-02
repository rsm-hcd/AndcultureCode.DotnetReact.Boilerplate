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

        #region Annexes

        public const string ANNEXES_READ = "ANNEXES_READ";

        #endregion Annexes

        #region Articles

        public const string ARTICLES_READ = "ARTICLES_READ";

        #endregion Articles

        #region Chapters

        public const string CHAPTERS_READ = "CHAPTERS_READ";

        #endregion Chapters

        #region Categories

        public const string CATEGORIES_CREATE = "CATEGORIES_CREATE";
        public const string CATEGORIES_DELETE = "CATEGORIES_DELETE";
        public const string CATEGORIES_READ = "CATEGORIES_READ";
        public const string CATEGORIES_UPDATE = "CATEGORIES_UPDATE";

        #endregion Categories

        #region Files

        public const string FILES_CREATE = "FILES_CREATE";
        public const string FILES_DELETE = "FILES_DELETE";
        public const string FILES_READ = "FILES_READ";

        #endregion Files

        #region Groups

        public const string GROUPS_CREATE = "GROUPS_CREATE";
        public const string GROUPS_READ = "GROUPS_READ";
        public const string GROUPS_UPDATE = "GROUPS_UPDATE";

        #endregion Groups

        #region Jobs

        public const string JOBS_CREATE = "JOBS_CREATE";

        #endregion Jobs

        #region Publications

        public const string PUBLICATIONS_READ = "PUBLICATIONS_READ";

        #endregion Publications

        #region PublicationMetadata

        public const string PUBLICATIONMETADATA_READ = "PUBLICATIONMETADATA_READ";

        #endregion Publications

        #region Parts

        public const string PARTS_READ = "PARTS_READ";

        #endregion Parts

        #region Roles
        public const string ROLE_CREATE = "ROLE_CREATE";
        public const string ROLE_DELETE = "ROLE_DELETE";
        public const string ROLE_READ = "ROLE_READ";
        public const string ROLE_UPDATE = "ROLE_UPDATE";

        #endregion Roles

        #region Search

        public const string SEARCHHITS_GET = "SEARCHHITS_GET";

        #endregion Search

        #region Sections

        public const string SECTIONS_READ = "SECTIONS_READ";

        #endregion Sections

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

        #region UserNotes

        public const string USERNOTES_CREATE = "USERNOTES_CREATE";
        public const string USERNOTES_DELETE = "USERNOTES_DELETE";
        public const string USERNOTES_READ = "USERNOTES_READ";
        public const string USERNOTES_UPDATE = "USERNOTES_UPDATE";

        #endregion UserNotes

        #region UserRoles

        public const string USERROLES_CREATE = "USERROLES_CREATE";
        public const string USERROLES_READ = "USERROLES_READ";
        public const string USERROLES_UPDATE = "USERROLES_UPDATE";

        #endregion UserRoles

        #region UserRoleGroups

        public const string USERROLEGROUPS_CREATE = "USERROLEGROUPS_CREATE";
        public const string USERROLEGROUPS_READ = "USERROLEGROUPS_READ";
        public const string USERROLEGROUPS_UPDATE = "USERROLEGROUPS_UPDATE";

        #endregion UserRoleGroups

        #region Situations

        public const string SITUATIONS_CREATE = "SITUATIONS_CREATE";
        public const string SITUATIONS_DELETE = "SITUATIONS_DELETE";
        public const string SITUATIONS_READ = "SITUATIONS_READ";
        public const string SITUATIONS_UPDATE = "SITUATIONS_UPDATE";

        #endregion Situations

        #region SituationCategories

        public const string SITUATIONCATEGORIES_READ = "SITUATIONCATEGORIES_READ";
        public const string SITUATIONCATEGORIES_UPDATE = "SITUATIONCATEGORIES_UPDATE";

        #endregion SituationCategories

        #region SituationSolutions

        public const string SITUATIONSOLUTIONS_READ = "SITUATIONSOLUTIONS_READ";
        public const string SITUATIONSOLUTIONS_UPDATE = "SITUATIONSOLUTIONS_UPDATE";

        #endregion SituationSolutions

        #region Solutions

        public const string SOLUTIONS_CREATE = "SOLUTIONS_CREATE";
        public const string SOLUTIONS_DELETE = "SOLUTIONS_DELETE";
        public const string SOLUTIONS_READ = "SOLUTIONS_READ";
        public const string SOLUTIONS_UPDATE = "SOLUTIONS_UPDATE";

        #endregion Solutions

        #region SolutionCategories

        public const string SOLUTIONCATEGORIES_READ = "SOLUTIONCATEGORIES_READ";
        public const string SOLUTIONCATEGORIES_UPDATE = "SOLUTIONCATEGORIES_UPDATE";

        #endregion SolutionCategories

        #region SolutionRelationships

        public const string SOLUTIONRELATIONSHIPS_CREATE = "SOLUTIONRELATIONSHIPS_CREATE";
        public const string SOLUTIONRELATIONSHIPS_READ = "SOLUTIONRELATIONSHIPS_READ";
        public const string SOLUTIONRELATIONSHIPS_DELETE = "SOLUTIONRELATIONSHIPS_DELETE";

        #endregion SolutionRelationships

        #region SolutionResources

        public const string SOLUTIONRESOURCES_CREATE = "SOLUTIONRESOURCES_CREATE";
        public const string SOLUTIONRESOURCES_DELETE = "SOLUTIONRESOURCES_DELETE";
        public const string SOLUTIONRESOURCES_READ = "SOLUTIONRESOURCES_READ";
        public const string SOLUTIONRESOURCES_UPDATE = "SOLUTIONRESOURCES_UPDATE";

        #endregion SolutionResources

        #region SolutionSections

        public const string SOLUTIONSECTIONS_READ = "SOLUTIONSECTIONS_READ";
        public const string SOLUTIONSECTIONS_UPDATE = "SOLUTIONSECTIONS_UPDATE";

        #endregion SolutionSections

        #region Topics

        public const string TOPICS_READ = "TOPICS_READ";
        public const string TOPICS_UPDATE = "TOPICS_UPDATE";

        #endregion Topics

        #region ExternalTopics

        public const string EXTERNALTOPICS_READ = "EXTERNALTOPICS_READ";
        public const string EXTERNALTOPICS_UPDATE = "EXTERNALTOPICS_UPDATE";

        #endregion ExternalTopics

        #region YouTube Metadata

        public const string YOUTUBE_METADATA_READ = "YOUTUBE_METADATA_READ";

        #endregion YouTube Metadata

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
