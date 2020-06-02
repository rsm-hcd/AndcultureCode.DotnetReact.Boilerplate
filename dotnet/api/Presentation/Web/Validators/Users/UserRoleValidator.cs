using FluentValidation;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Users;

namespace AndcultureCode.GB.Presentation.Web.Validators.Users
{
    public class UserRoleValidator : AbstractValidator<UserRoleDto>
    {
        public UserRoleValidator()
        {
            RuleFor(m => m.RoleId)
                .GreaterThan(0);

            RuleFor(m => m.UserId)
                .GreaterThan(0);
        }
    }
}
