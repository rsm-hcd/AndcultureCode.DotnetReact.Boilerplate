using System.Reflection;
using AndcultureCode.CSharp.Testing.Tests;
using Microsoft.Extensions.Localization;
using Moq;
using AndcultureCode.GB.Testing.Tests;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Business.Conductors.Tests.Unit
{
    public class ConductorUnitTest : ApiUnitTest
    {
        public ConductorUnitTest(ITestOutputHelper output) : base(output)
        {
        }

        /// <summary>
        /// Static constructor to set up suite-level actors
        /// </summary>
        static ConductorUnitTest()
        {
            LoadFactories(typeof(ConductorUnitTest).GetTypeInfo().Assembly);
        }

    }
}
