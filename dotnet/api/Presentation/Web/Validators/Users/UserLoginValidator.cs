using FluentValidation;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Users;

namespace AndcultureCode.GB.Presentation.Web.Validators.Users
{
    public class UserLoginValidator : AbstractValidator<UserLoginDto>
    {
        public UserLoginValidator()
        {
            RuleFor(m => m.Password)
                .MaximumLength(100)
                .NotEmpty();

            RuleFor(m => m.UserName)
                .NotEmpty();
        }
    }
}
