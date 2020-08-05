using System;
using System.Collections.Generic;
using System.Linq;
using AndcultureCode.CSharp.Business.Core.Models.Configuration;
using AndcultureCode.CSharp.Core;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Domain.Users;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using AndcultureCode.GB.Business.Core.Constants;

namespace AndcultureCode.GB.Infrastructure.Data.SqlServer.Seeds.Development
{
    public static class SeedsExtensions
    {
        #region Private Properties

        private static SeedsConfiguration _config;
        private static IUserLoginConductor<User> _userLoginConductor;
        private static List<User> _users = new List<User> {
            new User
            {
                Email = $"developer+{AppConstants.IDENTIFIER}@andculture.com",
                FirstName = "Super",
                IsSuperAdmin = true,
                LastName = "Admin",
                UserName = "superadmin",
            }
        };

        #endregion Private Properties

        #region Public Methods

        public static IResult<bool> SeedUsers(this Seeds seeds) => Do<bool>.TrySeed(seeds, (r) =>
        {
            var context = seeds.Context;
            _config = seeds.GetDep<SeedsConfiguration>();
            _userLoginConductor = seeds.GetDep<IUserLoginConductor<User>>();

            // Validation
            Validate();

            var existingUsers = context.Users.ToList();

            foreach (var user in _users)
            {
                var userName = user.UserName.ToLower();

                // If user already exists, skip
                if (existingUsers.Exists(u => u.UserName?.ToLower() == userName))
                {
                    continue;
                }

                _userLoginConductor
                    .SetPassword(user, _config.DefaultUserPassword)
                    .ThrowIfAnyErrors();

                context.Users.Add(user);
            }

            context.SaveChanges();

            return true;
        }).Result;

        #endregion Public Methods

        #region Private Methods

        private static void Validate()
        {
            if (_config == null)
            {
                throw new Exception("SeedsConfiguration not registered or configured");
            }

            if (_userLoginConductor == null)
            {
                throw new Exception("IUserLoginConductor not registered");
            }
        }

        #endregion Private Methods
    }
}
