using AndcultureCode.GB.Business.Core.Models;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer
{
    public class GBApiConnection : Connection
    {
        #region Overrides of Connection

        public override string ToString(string delimiter = ";")
        {
            return $"Data Source={Datasource}; Database={Database}; User Id={UserId}; Password={Password}; {AdditionalParameters}";
        }

        #endregion
    }
}