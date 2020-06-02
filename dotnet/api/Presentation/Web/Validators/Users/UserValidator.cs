using FluentValidation;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Users;

namespace AndcultureCode.GB.Presentation.Web.Validators.Users
{
    public class UserValidator : AbstractValidator<UserDto>
    {
        public UserValidator()
        {
            RuleFor(m => m.Email)
                .NotEmpty();

            RuleFor(m => m.FirstName)
                .NotEmpty();

            RuleFor(m => m.LastName)
                .NotEmpty();

            RuleFor(m => m.UserName)
                .NotEmpty();
        }
    }
}