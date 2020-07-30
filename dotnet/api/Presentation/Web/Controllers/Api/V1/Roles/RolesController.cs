using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Roles;
using AndcultureCode.GB.Presentation.Web.Attributes;
using Microsoft.Extensions.Localization;
using AndcultureCode.CSharp.Web.Interfaces;
using AndcultureCode.CSharp.Web.Extensions;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.Roles
{
    [FormatFilter]
    [ApiRoute("roles")]
    public class RolesController : ApiController, IApiEntityController<RolesController, Role>
    {
        #region Public Members

        public IRepositoryConductor<Role> Conductor { get; private set; }
        public ILogger<RolesController> Logger { get; private set; }
        public IMapper Mapper { get; private set; }

        #endregion Public Members

        #region Constructor

        public RolesController(
            IStringLocalizer localizer,
            ILogger<RolesController> logger,
            IMapper mapper,
            IRepositoryConductor<Role> conductor
        ) : base(localizer)
        {
            Conductor = conductor;
            Logger = logger;
            Mapper = mapper;
        }

        #endregion Constructor

        #region HTTP GET

        /// <summary>
        /// Get's a single Role
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Requested RoleDto</returns>
        /// <response code="200">Requested RoleDto</response>
        /// <response code="500">Error Getting Role</response>
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(RoleDto))]
        public IActionResult Get(long id) => this.GetDefault<RolesController, Role, RoleDto>(id);

        /// <summary>
        /// Get's Roles in the system
        /// </summary>
        /// <returns>List of RoleDtos</returns>
        /// <response code="200">List of RoleDtos</response>
        /// <response code="500">Error Getting Roles</response>
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IList<RoleDto>))]
        public IActionResult Index() => this.IndexDefault<RolesController, Role, RoleDto>();

        #endregion HTTP GET
    }
}
