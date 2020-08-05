using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;

namespace AndcultureCode.GB.Business.Core.Interfaces.Conductors.Domain.Users
{
    public interface IUserLoginConductor<TUser> : IConductor
        where TUser : User
    {
        /// <summary>
        /// Verifies if the supplied credentials are valid, returning
        /// the matching user if successful
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        IResult<TUser> Authenticate(string userName, string password);

        /// <summary>
        /// Configures the provided user's password related properties
        /// for the new provided password value
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        IResult<TUser> SetPassword(TUser user, string password);
    }
}
