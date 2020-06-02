using Microsoft.AspNetCore.Mvc;

namespace AndcultureCode.GB.Presentation.Web.Results
{
    public class ForbidObjectResult : ObjectResult
    {
        public ForbidObjectResult(object value) : base(value)
        {
            StatusCode = 403;
        }
    }
}