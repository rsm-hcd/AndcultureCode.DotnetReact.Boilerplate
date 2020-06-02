using System.Collections.Generic;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    public static class DictionaryExtensions
    {
        /// <summary>
        /// 'Merges' two dictionaries into one. If duplicate keys are encountered, either the first
        /// or last occurrence will be used. See 'takeLastKey'
        /// </summary>
        /// <param name="left">Dictionary to be merged into.</param>
        /// <param name="right">Dictionary to be merged into the left dictionary.</param>
        /// <param name="takeLastKey">
        /// Determines whether the value of the last occurrence of a key is used as the final value
        /// when duplicates are encountered. If false, uses the value of the first occurrence.
        /// </param>
        /// <typeparam name="TKey"></typeparam>
        /// <typeparam name="TValue"></typeparam>
        /// <returns></returns>
        public static Dictionary<TKey, TValue> Merge<TKey, TValue>(this Dictionary<TKey, TValue> left, Dictionary<TKey, TValue> right, bool takeLastKey = false)
        {
            if (left == null || right == null)
            {
                return left;
            }

            foreach (KeyValuePair<TKey, TValue> entry in right)
            {
                if (!left.ContainsKey(entry.Key))
                {
                    left.Add(entry.Key, entry.Value);
                    continue;
                }

                if (!takeLastKey)
                {
                    continue;
                }

                left.Remove(entry.Key);
                left.Add(entry.Key, entry.Value);
            }

            return left;
        }
    }
}
