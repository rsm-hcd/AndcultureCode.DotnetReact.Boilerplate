using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using AndcultureCode.GB.Presentation.Web.Attributes;
using AndcultureCode.GB.Presentation.Web.Controllers.Api.V1;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Microsoft.Extensions.Localization;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Users;
using AndcultureCode.CSharp.Core.Extensions;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Presentation.Web.Middleware.Authentication;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Domain.Users;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using AndcultureCode.CSharp.Business.Core.Models.Configuration;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.UserLogins
{
    [ApiRoute("userlogins")]
    [FormatFilter]
    [NoCache]
    public class UserLoginsController : ApiController
    {
        #region Private Members

        private readonly IRepositoryConductor<UserLogin> _conductor;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly CookieAuthenticationConfiguration _cookieAuthenticationConfiguration;
        private readonly HttpContext _httpContext;
        private readonly ILogger<UserLoginsController> _logger;
        private readonly IMapper _mapper;
        private readonly IUserLoginConductor<User> _userLoginConductor;
        private readonly IRepositoryReadConductor<User> _userReadConductor;
        private readonly IRepositoryReadConductor<UserRole> _userRoleReadConductor;

        #endregion Private Members

        #region Constructors

        public UserLoginsController(
            IRepositoryConductor<UserLogin> conductor,
            IConfigurationRoot configuration,
            IHttpContextAccessor contextAccessor,
            CookieAuthenticationConfiguration cookieAuthenticationConfiguration,
            IHttpContextAccessor httpContextAccessor,
            IStringLocalizer localizer,
            ILogger<UserLoginsController> logger,
            IMapper mapper,
            IUserLoginConductor<User> userLoginConductor,
            IRepositoryReadConductor<User> userReadConductor,
            IRepositoryReadConductor<UserRole> userRoleReadConductor
        ) : base(localizer)
        {
            _conductor = conductor;
            _contextAccessor = contextAccessor;
            _cookieAuthenticationConfiguration = cookieAuthenticationConfiguration;
            _httpContext = httpContextAccessor.HttpContext;
            _logger = logger;
            _mapper = mapper;
            _userLoginConductor = userLoginConductor;
            _userReadConductor = userReadConductor;
            _userRoleReadConductor = userRoleReadConductor;
        }

        #endregion Constructors

        #region DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] long id)
        {
            // Only allow deleting the Current UserLogin
            if (id != CurrentUserLoginId)
            {
                return Unauthorized();
            }

            // Perform signout in our system
            await _httpContext.SignOutAsync(AuthenticationUtils.AUTHENTICATION_SCHEME);

            // After successful logout, soft-delete from our system. If that fails, only log
            var deleteResult = _conductor.Delete(id, CurrentUserId);
            if (deleteResult.HasErrorsOrResultIsFalse())
            {
                _logger.LogWarning($"Failed to delete UserLogin {id} -- {deleteResult.ListErrors()}");
            }

            return Ok();
        }

        #endregion DELETE

        #region GET

        [HttpGet("cookie")]
        public IActionResult GetByCookie()
        {
            if (CurrentUserLoginId == null)
            {
                return NotFound();
            }

            var findResult = _conductor.FindById(CurrentUserLoginId.Value);
            if (findResult.HasErrorsOrResultIsNull())
            {
                return InternalError<UserLoginDto>(findResult.Errors, _logger);
            }

            return Ok(_mapper.Map<UserLoginDto>(findResult.ResultObject));
        }

        #endregion GET

        #region POST

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] UserLoginDto dto,
            [FromQuery] long? roleId = null
        )
        {
            var userName = dto.UserName?.ToLower();
            var authenticationResult = _userLoginConductor.Authenticate(userName, dto.Password);
            if (authenticationResult.HasErrorsOrResultIsNull())
            {
                return HandleFailedLogin(userName, authenticationResult.Errors);
            }

            var user = authenticationResult.ResultObject;
            var createResult = CreateUserLogin(userName, user.Id, roleId);
            if (createResult.HasErrorsOrResultIsNull())
            {
                return InternalError<UserLoginDto>(createResult.Errors, _logger);
            }

            var userLogin = createResult.ResultObject;

            await SignInUser(userLogin);

            return Created(userLogin.Id, _mapper.Map<UserLoginDto>(userLogin));
        }

        #endregion POST

        #region Private Methods

        private IResult<UserLogin> CreateUserLogin(
            string userName,
            long? userId = null,
            long? roleId = null,
            bool isSuccessful = true
        )
        {
            var userLogin = new UserLogin
            {
                FailedAttemptCount = isSuccessful ? 0 : 1,
                Ip = IpAddress,
                IsSuccessful = isSuccessful,
                RoleId = roleId,
                ServerName = Environment.MachineName,
                UserAgent = UserAgent,
                UserId = userId,
                UserName = userName
            };

            return _conductor.Create(userLogin, userId);
        }

        private IActionResult HandleCreateOrUpdate<T>(IResult<T> r, List<IError> errors)
        {
            if (r.HasErrorsOrResultIsNull())
            {
                return InternalError<UserLoginDto>(r.Errors, _logger);
            }

            return BadRequest<UserLoginDto>(errors);
        }

        private IActionResult HandleFailedLogin(string userName, List<IError> errors)
        {
            // Find the last UserLogin for this Username
            var userLoginResult = _conductor.FindAll(e => e.Ip == IpAddress && e.UserName == userName);
            var userLogin = userLoginResult.ResultObject?.OrderByDescending(e => e.CreatedOn)?.FirstOrDefault();

            // If last UserLogin is null or was successful create a new failed one.
            if (userLogin == null || userLogin.IsSuccessful)
            {
                var createResult = CreateUserLogin(userName, isSuccessful: false);
                return HandleCreateOrUpdate(createResult, errors);
            }

            userLogin.FailedAttemptCount += 1;
            userLogin.UserAgent = UserAgent;

            return HandleCreateOrUpdate(_conductor.Update(userLogin), errors);
        }

        /// <summary>
        /// Signs User into system. If User is already Signed-In, this will update their
        /// Authentication cookie.
        /// </summary>
        private async Task SignInUser(UserLogin userLogin)
        {
            var authenticationProperties = AuthenticationUtils.GetAuthenticationProperties();
            var userRolesResult = _userRoleReadConductor.FindAll(e => e.UserId == userLogin.UserId);
            var roleIds = userRolesResult.ResultObject?.Select(e => e.RoleId);

            var claims = AuthenticationUtils.GetClaims(
                roleIds: roleIds,
                user: userLogin.User,
                userLogin: userLogin
            );
            var userPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims, AuthenticationUtils.AUTHENTICATION_TYPE));

            await _httpContext.SignInAsync(AuthenticationUtils.AUTHENTICATION_SCHEME, userPrincipal, authenticationProperties);
        }

        #endregion Private Methods
    }
}
