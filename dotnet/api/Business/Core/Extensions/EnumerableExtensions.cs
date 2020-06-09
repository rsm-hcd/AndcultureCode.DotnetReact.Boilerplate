using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    // TODO: Move to AndcultureCode.CSharp.Extensions
    public static class EnumerableExtensions
    {
        /// <summary>
        /// Returns a distinct enumerable by a specific property
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TKey"></typeparam>
        /// <param name="source"></param>
        /// <param name="property"></param>
        /// <returns></returns>
        public static IEnumerable<T> DistinctBy<T, TKey>(this IEnumerable<T> source, Func<T, TKey> property)
            => source.GroupBy(property).Select(x => x.First());

        /// <summary>
        /// Returns a distinct list by a specific property
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TKey"></typeparam>
        /// <param name="source"></param>
        /// <param name="property"></param>
        /// <returns></returns>
        public static IEnumerable<T> DistinctBy<T, TKey>(this List<T> source, Func<T, TKey> property)
            => source.GroupBy(property).Select(x => x.First());

        /// <summary>
        /// Returns a list of items, grouped by adjacent values
        /// Source: https://stackoverflow.com/questions/4681949/use-linq-to-group-a-sequence-of-numbers-with-no-gaps/4682163#4682163
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public static IEnumerable<IEnumerable<T>> GroupAdjacentBy<T>(this IEnumerable<T> source, Func<T, T, bool> predicate)
        {
            using (var e = source.GetEnumerator())
            {
                if (e.MoveNext())
                {
                    var list = new List<T> { e.Current };
                    var pred = e.Current;
                    while (e.MoveNext())
                    {
                        if (predicate(pred, e.Current))
                        {
                            list.Add(e.Current);
                        }
                        else
                        {
                            yield return list;
                            list = new List<T> { e.Current };
                        }
                        pred = e.Current;
                    }
                    yield return list;
                }
            }
        }

        /// <summary>
        /// Convenience of checking if enumerable is null before adding range
        /// </summary>
        /// <param name="self"></param>
        /// <param name="newItems"></param>
        /// <typeparam name="T"></typeparam>
        public static void AddTo<T>(this List<T> self, IEnumerable<T> newItems)
        {
            if (newItems != null)
            {
                self.AddRange(newItems);
            }
        }
    }
}