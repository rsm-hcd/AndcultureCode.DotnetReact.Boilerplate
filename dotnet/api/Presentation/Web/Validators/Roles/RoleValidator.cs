using FluentValidation;
using AndcultureCode.GB.Business.Core.Models.Configuration;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Roles;
using AndcultureCode.CSharp.Core.Models.Configuration;

namespace AndcultureCode.GB.Presentation.Web.Validators.Roles
{
    public class RoleValidator : AbstractValidator<RoleDto>
    {
        public RoleValidator()
        {
            RuleFor(m => m.Description)
                .MaximumLength(DataConfiguration.LONG_DESCRIPTION_LENGTH);

            RuleFor(m => m.Name)
                .NotEmpty()
                .MaximumLength(DataConfiguration.SHORT_STRING_LENGTH);
        }
    }
}
