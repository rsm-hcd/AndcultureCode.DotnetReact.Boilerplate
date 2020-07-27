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
        /// <returns></returns>
        IResult<TUser> Authenticate(string userName, string password);

        /// <summary>
        /// Generates a hash from the given value and salt
        /// </summary>
        /// <param name="value">Value to hash</param>
        /// <param name="salt">Salt to use (base 64 string)</param>
        /// <param name="iterationCount">Iterations to perform (at least 10000)</param>
        /// <param name="bits">Size of the hash in bits</param>
        /// <returns>Base 64 encoded string of the hash</returns>
        string GenerateHash(string value, string salt, int iterationCount = 10000, ushort bits = 256);

        /// <summary>
        /// Generate a salt to be used for hashing
        /// </summary>
        /// <param name="bits">Size of the salt to generate in bits (must be a multiple of 8)</param>
        /// <returns>Base 64 encoded string of the salt</returns>
        string GenerateSalt(ushort bits = 128);
    }
}
