using System.Reflection;
using AndcultureCode.CSharp.Testing.Tests;
using Microsoft.Extensions.Localization;
using Moq;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Testing.Tests
{
    public class ApiUnitTest : BaseUnitTest
    {
        #region Constructors

        public ApiUnitTest(ITestOutputHelper output) : base(output) { }

        public IStringLocalizer MockLocalizer => Mock.Of<IStringLocalizer>();

        static ApiUnitTest()
        {
            LoadFactories(typeof(ApiUnitTest).GetTypeInfo().Assembly);
        }

        #endregion
    }
}