using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using AndcultureCode.GB.Presentation.Web.Extensions.Validation;

namespace AndcultureCode.GB.Presentation.Web.Filters.Validation
{
    public class ValidationFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.ModelState.IsValid)
            {
                return;
            }

            // Return an IResult containing all validation errors
            context.Result = new BadRequestObjectResult(context.ModelState.ToResult<object>());
        }
    }
}
