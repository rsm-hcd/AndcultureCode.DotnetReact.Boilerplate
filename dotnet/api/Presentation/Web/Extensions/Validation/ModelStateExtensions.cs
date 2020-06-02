using AndcultureCode.CSharp.Core.Enumerations;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace AndcultureCode.GB.Presentation.Web.Extensions.Validation
{
    public static class ModelStateExtensions
    {
        public static IResult<T> ToResult<T>(this ModelStateDictionary modelState)
        {
            var result = new Result<T>();

            foreach (var entry in modelState)
            {
                foreach (var err in entry.Value.Errors)
                {
                    if (string.IsNullOrWhiteSpace(err.ErrorMessage))
                    {
                        result.AddError(ErrorType.ValidationError, entry.Key, err.Exception.Message);
                    }
                    else
                    {
                        result.AddError(ErrorType.ValidationError, entry.Key, err.ErrorMessage);
                    }
                }
            }

            return result;
        }
    }
}
