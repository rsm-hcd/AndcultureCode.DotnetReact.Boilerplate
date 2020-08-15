using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Users;
using AndcultureCode.GB.Presentation.Web.Attributes;
using Microsoft.Extensions.Localization;
using AndcultureCode.CSharp.Web.Interfaces;
using AndcultureCode.CSharp.Web.Extensions;
// using AndcultureCode.CSharp.Web.Extensions;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.Users
{
    [FormatFilter]
    [ApiRoute("users")]
    public class UsersController : ApiController, IApiEntityController<UsersController, User>
    {
        #region Public Members

        public IRepositoryConductor<User> Conductor { get; private set; }
        public ILogger<UsersController> Logger { get; private set; }
        public IMapper Mapper { get; private set; }

        #endregion Public Members

        #region Constructor

        public UsersController(
            IStringLocalizer localizer,
            ILogger<UsersController> logger,
            IMapper mapper,
            IRepositoryConductor<User> conductor
        ) : base(localizer)
        {
            Conductor = conductor;
            Logger = logger;
            Mapper = mapper;
        }

        #endregion Constructor

        #region HTTP GET

        /// <summary>
        /// Get's a single User
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Requested UserDto</returns>
        /// <response code="200">Requested UserDto</response>
        /// <response code="500">Error Getting User</response>
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(UserDto))]
        public IActionResult Get(long id)
        {
            // Only super admins can view other user records
            if (!IsSuperAdmin && id != CurrentUserId)
            {
                return Unauthorized();
            }

            return this.GetDefault<UsersController, User, UserDto>(id);
        }

        /// <summary>
        /// Get's Users in the system
        /// </summary>
        /// <returns>List of UserDtos</returns>
        /// <response code="200">List of UserDtos</response>
        /// <response code="500">Error Getting Users</response>
        [AclAuthorize(isSuperAdminRequired: true)]
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IList<UserDto>))]
        public IActionResult Index() => this.IndexDefault<UsersController, User, UserDto>();

        #endregion HTTP GET
    }
}
