using AndcultureCode.CSharp.Core.Models;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer
{
    public class GBApiConnection : Connection
    {
        public override string ToString(string delimiter = ";")
            => $"Data Source={Datasource}; Database={Database}; User Id={UserId}; Password={Password}; {AdditionalParameters}";
    }
}
