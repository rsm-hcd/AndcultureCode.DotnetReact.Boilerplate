using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Testing.Constants;
using AndcultureCode.CSharp.Testing.Extensions;
using AndcultureCode.GB.Presentation.Web.Controllers;

namespace AndcultureCode.GB.Presentation.Web.Tests.Extensions
{
    public static class IResultMatcherExtensions
    {
        /// <summary>
        /// Extension method to assert error exists for `ERROR_RESOURCE_NOT_FOUND_KEY`
        /// </summary>
        /// <param name="result"></param>
        /// <typeparam name="T"></typeparam>
        public static void ShouldHaveResourceNotFoundError<T>(this IResult<T> result)
        {
            // Calling this assertion first as it provides a more descriptive error message if
            // it fails
            //      ShouldHaveErrors - Expected result to have errors, but instead Errors is 'null'
            //      ShouldHaveErrorsFor - Value cannot be null. (Parameter 'source')
            // Look into updating for the ShouldHaveErrorsFor extension method this if/when these
            // are ported over to the testing package
            result.ShouldHaveErrors();
            result.ShouldHaveErrorsFor(Controller.ERROR_RESOURCE_NOT_FOUND_KEY);
        }

        /// <summary>
        /// Extension method to assert error exists for `BASIC_ERROR_KEY`
        /// </summary>
        /// <param name="result"></param>
        /// <typeparam name="T"></typeparam>
        // DEVELOPER NOTE: This should probably be moved into AndcultureCode.CSharp.Testing
        // See https://github.com/AndcultureCode/AndcultureCode.CSharp.Testing/issues/6
        public static void ShouldHaveBasicError<T>(this IResult<T> result)
        {
            // Calling this assertion first as it provides a more descriptive error message if
            // it fails
            //      ShouldHaveErrors - Expected result to have errors, but instead Errors is 'null'
            //      ShouldHaveErrorsFor - Value cannot be null. (Parameter 'source')
            // Look into updating for the ShouldHaveErrorsFor extension method this if/when these
            // are ported over to the testing package
            result.ShouldHaveErrors();
            result.ShouldHaveErrorsFor(ErrorConstants.BASIC_ERROR_KEY);
        }
    }
}