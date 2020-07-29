using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace AndcultureCode.GB.Business.Core.Utilities
{
    /// <summary>
    /// TODO: Abstract to AndcultureCode.CSharp.Core before PR
    /// </summary>
    public static class EncryptionUtils
    {
        /// <summary>
        /// Generates a hash from the given value and salt
        /// </summary>
        /// <param name="value">Value to hash</param>
        /// <param name="salt">Salt to use (base 64 string)</param>
        /// <param name="iterationCount">Iterations to perform (at least 10000)</param>
        /// <param name="bits">Size of the hash in bits</param>
        /// <returns>Base 64 encoded string of the hash</returns>
        public static string GenerateHash(string value, string salt, int iterationCount = 10000, ushort bits = 256)
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
        public static string GenerateSalt(ushort bits = 128)
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
    }
}
