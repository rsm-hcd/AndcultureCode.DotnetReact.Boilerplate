using System.Collections.Generic;
using AndcultureCode.CSharp.Extensions;
using FluentValidation;
using Newtonsoft.Json;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Jobs;

namespace AndcultureCode.GB.Presentation.Web.Validators.Jobs
{
    public class JobValidator : DtoAbstractValidator<JobDto>
    {
        public JobValidator()
        {
            RuleFor(m => m.WorkerName)
                .NotEmpty();

            RuleFor(m => m.WorkerArgs)
                .Must(BeValidJsonStringThatConvertsToListOfObjects);
        }

        private bool BeValidJsonStringThatConvertsToListOfObjects<TDto>(TDto dto, string value)
        {
            if (value.IsNullOrEmpty())
            {
                return false;
            }

            try
            {
                JsonConvert.DeserializeObject<List<object>>(value);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
