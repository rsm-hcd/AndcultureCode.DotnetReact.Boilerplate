using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using AndcultureCode.CSharp.Core;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using Newtonsoft.Json;

namespace AndcultureCode.GB.Business.Core.Extensions
{
    public static class StringExtensions
    {
        #region Public Constants

        public const string ERROR_CONVERTING_TO_TYPE = "StringExtensions.ConvertToT";

        #endregion Public Constants

        #region Public Methods

        public static IResult<T> Convert<T>(this string source) where T : IConvertible => Do<T>.Try((r) =>
        {
            return (T)System.Convert.ChangeType(source, typeof(T));
        })
        .Catch((Exception e, IResult<T> r) =>
        {
            r.AddError(
                ERROR_CONVERTING_TO_TYPE,
                $"Unable to convert string '{source}' to type {typeof(T).Name}"
            );

            r.ResultObject = default(T);
        })
        .Result;

        #endregion Public Methods
    }
}
