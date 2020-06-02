using AutoMapper;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Business.Core.Models.Jobs;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Jobs;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Roles;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Users;
using AndcultureCode.GB.Business.Core.Models.Storage;

namespace AndcultureCode.GB.Presentation.Web.Models
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Jobs
            CreateMap<Job, JobDto>();

            // RemoteAccessDetails
            CreateMap<RemoteAccessDetails, RemoteAccessDetailsDto>();

            // Roles
            CreateMap<Role, RoleDto>();

            // Users
            CreateMap<User, UserDto>();

            // UserLogins
            CreateMap<UserLogin, UserLoginDto>();

            // UserRoles
            CreateMap<UserRole, UserRoleDto>();
        }
    }
}
