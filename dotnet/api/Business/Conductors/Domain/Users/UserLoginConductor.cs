using System;
using System.Linq;
using AndcultureCode.CSharp.Core;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.CSharp.Core.Utilities.Security;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Domain.Users;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Microsoft.Extensions.Localization;

namespace AndcultureCode.GB.Business.Conductors.Domain.UserLogins
{
    public class UserLoginConductor<TUser> : IUserLoginConductor<TUser>
        where TUser : User
    {
        #region Constants

        public const string ERROR_INVALID_CREDENTIALS = "ERROR_INVALID_CREDENTIALS";

        #endregion Constants

        #region Properties

        private readonly IStringLocalizer _localizer;
        private readonly IRepositoryReadConductor<TUser> _userReadConductor;

        #endregion Properties

        #region Constructors

        public UserLoginConductor(
            IStringLocalizer localizer,
            IRepositoryReadConductor<TUser> userReadConductor
        )
        {
            _localizer = localizer;
            _userReadConductor = userReadConductor;
        }

        #endregion Constructors

        #region Public Methods

        public IResult<TUser> Authenticate(string userName, string password) => Do<TUser>.Try(r =>
        {
            userName = userName.ToLower();

            var userResult = _userReadConductor.FindAll(e => e.UserName.ToLower() == userName);
            if (userResult.HasErrors)
            {
                return r.AddErrorsAndReturnDefault(userResult);
            }

            // Ensure user exists and password is valid
            var user = userResult.ResultObject.FirstOrDefault();
            if (user == null || user.PasswordHash != EncryptionUtils.GenerateHash(password, user.Salt))
            {
                return InvalidCredentialsError(r);
            }

            return user;
        }).Result;

        public IResult<TUser> SetPassword(TUser user, string password) => Do<TUser>.Try(r =>
        {
            var salt = EncryptionUtils.GenerateSalt();

            user.PasswordHash = EncryptionUtils.GenerateHash(password, salt);
            user.Salt = salt;
            user.SecurityStamp = Guid.NewGuid().ToString("N");

            return user;
        }).Result;

        #endregion Public Methods

        #region Private Methods

        private TUser InvalidCredentialsError(IResult<TUser> result)
        {
            result.AddValidationError(_localizer, ERROR_INVALID_CREDENTIALS);
            return null;
        }

        #endregion Private Methods
    }
}
