using System;
using System.Collections.Generic;
using FluentValidation.TestHelper;
using Newtonsoft.Json;
using AndcultureCode.GB.Presentation.Web.Validators.Jobs;
using AndcultureCode.GB.Testing.Tests;
using Xunit;
using Xunit.Abstractions;

namespace AndcultureCode.GB.Presentation.Web.Tests.Unit.Validators.Jobs
{
    public class JobValidatorTest : ApiUnitTest, IDisposable
    {
        #region Member Variables

        JobValidator _sut;

        #endregion Member Variables

        #region Setup

        public JobValidatorTest(ITestOutputHelper output) : base(output)
        {
            _sut = new JobValidator();
        }

        #endregion Setup

        #region WorkerArgs

        [Fact]
        public void WorkerArgs_ShouldHaveError_When_Empty()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.WorkerArgs, string.Empty);
        }

        [Fact]
        public void WorkerArgs_ShouldHaveError_When_Invalid_Json()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.WorkerArgs, "Invalid Json");
        }

        [Fact]
        public void WorkerArgs_ShouldNotHaveErrors_With_Valid_Json()
        {
            List<object> workerArgs = new List<object> { 1, 1L, "string" };
            var json = JsonConvert.SerializeObject(workerArgs);
            _sut.ShouldNotHaveValidationErrorFor(m => m.WorkerArgs, json);
        }

        [Fact]
        public void WorkerArgs_ShouldHaveValidationError_For_Unconvertible_Json()
        {
            var json = JsonConvert.SerializeObject("string");
            _sut.ShouldHaveValidationErrorFor(m => m.WorkerArgs, json);
        }

        #endregion WorkerArgs

        #region WorkerName

        [Fact]
        public void WorkerName_ShouldHaveError_When_Empty()
        {
            _sut.ShouldHaveValidationErrorFor(m => m.WorkerName, string.Empty);
        }

        [Fact]
        public void WorkerName_ShouldNotHaveError_When_Valid_String()
        {
            _sut.ShouldNotHaveValidationErrorFor(m => m.WorkerName, "WorkerName");
        }

        #endregion

    }
}
