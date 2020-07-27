using System;
using System.Linq;
using System.Security.Cryptography;
using AndcultureCode.CSharp.Core;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.CSharp.Core.Interfaces.Data;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Domain.Users;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
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
            // -----------------------------------------
            if (user == null)
            {
                r.AddValidationError(_localizer, ERROR_INVALID_CREDENTIALS);
                return null;
            }

            // Hash the password
            // -----------------
            var passwordHash = GenerateHash(password, user.Salt);

            // Validate password
            // -----------------
            if (user.PasswordHash != passwordHash)
            {
                r.AddValidationError(_localizer, ERROR_INVALID_CREDENTIALS);
                return null;
            }

            return user;
        }).Result;

        /// <summary>
        /// Generates a hash from the given value and salt
        /// </summary>
        /// <param name="value">Value to hash</param>
        /// <param name="salt">Salt to use (base 64 string)</param>
        /// <param name="iterationCount">Iterations to perform (at least 10000)</param>
        /// <param name="bits">Size of the hash in bits</param>
        /// <returns>Base 64 encoded string of the hash</returns>
        public string GenerateHash(string value, string salt, int iterationCount = 10000, ushort bits = 256)
        {
            if (iterationCount < 10000)
            {
                throw new ArgumentOutOfRangeException("Iteration count must be at least 10000");
            }

            if (bits < 256)
            {
                throw new ArgumentOutOfRangeException("Bits must be at least 256");
            }

            if (bits % 8 > 0)
            {
                throw new ArgumentException("Bits must be a multiple of 8");
            }

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                iterationCount: iterationCount,
                numBytesRequested: bits / 8,
                password: value,
                prf: KeyDerivationPrf.HMACSHA1,
                salt: Convert.FromBase64String(salt)
            ));

            return hashed;
        }

        /// <summary>
        /// Generate a salt to be used for hashing
        /// </summary>
        /// <param name="bits">Size of the salt to generate in bits (must be a multiple of 8)</param>
        /// <returns>Base 64 encoded string of the salt</returns>
        public string GenerateSalt(ushort bits = 128)
        {
            if (bits < 128)
            {
                throw new ArgumentOutOfRangeException("Bits must be at least 128");
            }

            if (bits % 8 > 0)
            {
                throw new ArgumentException("Bits must be a multiple of 8");
            }

            var salt = new byte[bits / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            return Convert.ToBase64String(salt);
        }

        #endregion Public Methods
    }
}
