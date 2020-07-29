using System;
using System.Linq;
using AndcultureCode.CSharp.Core;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Domain.Users;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Business.Core.Utilities;
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
            var userResult = _userReadConductor.FindAll(e => e.UserName.ToLower() == userName && e.DeletedOn == null);
            var user = userResult.ResultObject.FirstOrDefault();

            // No user found with the specified userName
            if (user == null)
            {
                r.AddValidationError(_localizer, ERROR_INVALID_CREDENTIALS);
                return null;
            }

            // Hash the password
            var passwordHash = EncryptionUtils.GenerateHash(password, user.Salt);

            // Validate password
            if (user.PasswordHash != passwordHash)
            {
                r.AddValidationError(_localizer, ERROR_INVALID_CREDENTIALS);
                return null;
            }

            return user;
        }).Result;

        public IResult<TUser> ConfigurePassword(TUser user, string newPassword) => Do<TUser>.Try(r =>
        {
            var salt = EncryptionUtils.GenerateSalt();

            user.PasswordHash = EncryptionUtils.GenerateHash(newPassword, salt);
            user.Salt = salt;
            user.SecurityStamp = Guid.NewGuid().ToString("N");

            return user;
        }).Result;

        #endregion Public Methods
    }
}
