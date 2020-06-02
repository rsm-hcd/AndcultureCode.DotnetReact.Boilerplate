using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    public static class TypeExtensions
    {
        /// <summary>
        /// Retrieve all constant values for given type whose value matches type of <T>
        /// </summary>
        public static List<T> GetPublicConstantValues<T>(this Type type) =>
            type.GetFields(BindingFlags.Public | BindingFlags.Static)
                .Where(f => f.IsLiteral && !f.IsInitOnly && f.FieldType == typeof(T))
                .Select(f => (T)f.GetRawConstantValue())
                .ToList();

        /// <summary>
        /// Returns the name the underlying type of any object
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string GetTypeName(this object obj) => GetTypeName(obj.GetType());

        /// <summary>
        /// Returns the full name of the type as well as the assembly qualified name
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static string GetTypeName(this Type type) => type.FullName + ", " + type.AssemblyQualifiedName;

        /// <summary>
        /// Filters the provided list of types to only those that are
        /// decorated with the TAttribute attribute at the class level.
        /// </summary>
        public static List<Type> WhereWithAttribute<TAttribute>(this IEnumerable<Type> types) where TAttribute : Attribute
            => types.Where(t => t.GetCustomAttribute<TAttribute>() != null).Distinct().ToList();

        /// <summary>
        /// Filters the provided list of types to only those that aren't
        /// decorated with the TAttribute attribute at the class level.
        /// </summary>
        public static List<Type> WhereWithoutAttribute<TAttribute>(this IEnumerable<Type> types) where TAttribute : Attribute
            => types.Where(t => t.GetCustomAttribute<TAttribute>() == null).Distinct().ToList();
    }
}
