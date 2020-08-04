using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Shouldly;

namespace AndcultureCode.GB.Presentation.Web.Tests.Extensions
{
    // TODO: Move to either AndcultureCode.CSharp.Testing or AndcultureCode.CSharp.Extensions projects
    public static class IActionResultExtensions
    {
        public static T AsHttpResult<T>(this IActionResult action) where T : class
        {
            var assertionMessage = $"Expected type to be '{typeof(T).Name}', but was '{action.GetType()}'";

            if (action is ObjectResult)
            {
                var objectResult = action as ObjectResult;

                assertionMessage += " with status code of '" + objectResult.StatusCode + "'";
                assertionMessage += "\r\n\r\n";
                assertionMessage += JsonConvert.SerializeObject(objectResult.Value, Formatting.Indented);
            }

            action.ShouldBeOfType<T>(assertionMessage);
            return action as T;
        }

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'Accepted'
        /// and additionally the result object is of the supplied type 'T'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static T AsAccepted<T>(this IActionResult action) where T : class
        {
            var response = action.AsHttpResult<AcceptedResult>();
            response.Value.ShouldBeOfType<T>();
            return response.Value as T;
        }

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'BadRequest'
        /// and additionally the result object is of the supplied type 'T'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static T AsBadRequest<T>(this IActionResult action) where T : class
        {
            var response = action.AsHttpResult<BadRequestObjectResult>();
            response.Value.ShouldBeOfType<T>();
            return response.Value as T;
        }

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'BadRequest'
        /// and additionally the result object is of the supplied type 'T'
        /// /// </summary>
        /// <typeparam name="T"></typeparam>
        public static T AsBadRequest<T>(this Task<IActionResult> actionTask) where T : class
            => actionTask.Result.AsBadRequest<T>();

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'Conflict'
        /// and additionally the result object is of the supplied type 'T'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static T AsConflict<T>(this IActionResult action) where T : class
        {
            var response = action.AsHttpResult<ObjectResult>();
            response.StatusCode.ShouldBe(StatusCodes.Status409Conflict);
            response.Value.ShouldBeOfType<T>();
            return response.Value as T;
        }

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'Created'
        /// and additionally the result object is of the supplied type 'T'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static T AsCreated<T>(this IActionResult action) where T : class
        {
            var response = action.AsHttpResult<CreatedResult>();
            response.Value.ShouldBeOfType<T>();
            return response.Value as T;
        }

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'Forbidden'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static T AsForbidden<T>(this IActionResult action) where T : class
        {
            var response = action.AsHttpResult<ObjectResult>();
            response.StatusCode.ShouldBe(StatusCodes.Status403Forbidden);
            response.Value.ShouldBeOfType<T>();
            return response.Value as T;
        }

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'InternalError'
        /// and additionally the result object is of the supplied type 'T'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="shouldValidateType">Use 'false' when value of response is NULL to bypass type checking</param>
        public static T AsInternalError<T>(this IActionResult action, bool? shouldValidateType = true) where T : class
        {
            var response = action.AsHttpResult<ObjectResult>();
            response.StatusCode.ShouldBe(StatusCodes.Status500InternalServerError);
            if (shouldValidateType.HasValue && shouldValidateType.Value)
            {
                response.Value.ShouldBeOfType<T>();
            }
            return response.Value as T;
        }

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'NoContent'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static void AsNoContent(this IActionResult action) => action.AsHttpResult<NoContentResult>();

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'NotFound'
        /// and additionally the result object is of the supplied type 'T'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static T AsNotFound<T>(this IActionResult action) where T : class
        {
            var response = action.AsHttpResult<NotFoundObjectResult>();
            response.Value.ShouldBeOfType<T>();
            return response.Value as T;
        }

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'Ok'
        /// and additionally the result object is of the supplied type 'T'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static T AsOk<T>(this IActionResult action) where T : class
        {
            var response = action.AsHttpResult<OkObjectResult>();
            response.Value.ShouldBeOfType<T>();
            return response.Value as T;
        }

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'Unauthorized'
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static void AsUnauthorized<T>(this IActionResult action) where T : class
            => action.AsHttpResult<UnauthorizedResult>();

        /// <summary>
        /// Verifies the result is the correct HTTP response type of 'FileContentResult'
        /// </summary>
        public static void AsFile(this IActionResult action) => action.AsHttpResult<FileContentResult>();
    }
}
