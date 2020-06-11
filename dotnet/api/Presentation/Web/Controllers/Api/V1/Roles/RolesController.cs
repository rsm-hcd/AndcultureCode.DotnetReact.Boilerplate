using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Business.Core.Models.Entities.Roles;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Roles;
using AndcultureCode.GB.Presentation.Web.Attributes;
using Microsoft.Extensions.Localization;
using AndcultureCode.GB.Business.Core.Models.Security;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.Roles
{
    [FormatFilter]
    [ApiRoute("roles")]
    public class RolesController : ApiController
    {
        #region Private Members

        private readonly ILogger<RolesController> _logger;
        private readonly IMapper _mapper;
        private readonly IRepositoryConductor<Role> _repositoryConductor;

        #endregion Private Members


        #region Constructor

        public RolesController(
            IStringLocalizer localizer,
            ILogger<RolesController> logger,
            IMapper mapper,
            IRepositoryConductor<Role> repositoryConductor
        ) : base(localizer)
        {
            _logger = logger;
            _mapper = mapper;
            _repositoryConductor = repositoryConductor;
        }

        #endregion Constructor


        #region Get

        /// <summary>
        /// Get's a single Role
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Requested RoleDto</returns>
        /// <response code="200">Requested RoleDto</response>
        /// <response code="500">Error Getting Role</response>
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(RoleDto))]
        public IActionResult Get(long id)
        {
            var readResult = _repositoryConductor.FindById(id);
            if (readResult.HasErrors)
            {
                return InternalError<RoleDto>(null, readResult.Errors, _logger);
            }

            var role = readResult.ResultObject;
            if (role == null)
            {
                return NotFound<RoleDto>();
            }

            return Ok(_mapper.Map<RoleDto>(role), null);
        }

        /// <summary>
        /// Get's Roles in the system
        /// </summary>
        /// <returns>List of RoleDtos</returns>
        /// <response code="200">List of RoleDtos</response>
        /// <response code="500">Error Getting Roles</response>
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IList<RoleDto>))]
        public IActionResult Index()
        {
            var readResult = _repositoryConductor.FindAll();
            if (readResult.HasErrors)
            {
                return InternalError<List<RoleDto>>(null, readResult.Errors, _logger);
            }

            return Ok(_mapper.Map<List<RoleDto>>(readResult.ResultObject), null);
        }

        #endregion Get
    }
}