using System;
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.Serialization;
using AndcultureCode.CSharp.Core;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using Microsoft.Extensions.Logging;
using AndcultureCode.GB.Business.Core.Interfaces.Providers.Xml;

namespace AndcultureCode.GB.Business.Core.Providers.Xml
{
    public class XmlProvider : IXmlProvider
    {
        #region Public Constants

        public const string ERROR_FILE_NOT_FOUND = "XmlProvider.Deserialize.ErrorFileNotFound";
        public const string ERROR_FILE_PATH_NULL_OR_WHITESPACE = "XmlProvider.Deserialize.ErrorFilePathNullOrWhitespace";
        public const string ERROR_XML_DESERIALIZATION = "XmlProvider.Deserialize.XmlDeserialization";

        #endregion Public Constants

        #region Private Members

        private string _xmlFilePath;
        private ILogger<IXmlProvider> _logger;

        #endregion Private Members

        #region Constructor

        public XmlProvider(ILogger<IXmlProvider> logger)
        {
            _logger = logger;
        }

        #endregion Constructor

        #region Public Methods

        public IResult<T> Deserialize<T>(string xmlFilePath) => Do<T>.Try((r) =>
        {
            // Save file path for logging debug events
            _xmlFilePath = xmlFilePath;

            if (String.IsNullOrWhiteSpace(xmlFilePath))
            {
                r.AddError(ERROR_FILE_PATH_NULL_OR_WHITESPACE, $"Filepath is null or whitespace");
                return default(T);
            }

            if (!File.Exists(xmlFilePath))
            {
                r.AddError(ERROR_FILE_NOT_FOUND, $"Xml File Not Found at path: {xmlFilePath}");
                return default(T);
            }

            T obj;
            var serializer = new XmlSerializer(typeof(T));

            // Attach these event handlers for debugging purposes
            serializer.UnknownAttribute += UnknownAttribute;
            serializer.UnknownElement += UnknownElement;

            using (var reader = XmlReader.Create(xmlFilePath))
            {
                obj = (T)serializer.Deserialize(reader);
            }

            return obj;

        })
        .Catch((Exception exception, IResult<T> result) =>
        {
            result.AddError(
                ERROR_XML_DESERIALIZATION,
                $"Xml Deserialization Failed for file: {xmlFilePath}"
            );
            result.ResultObject = default(T);

        }).Result;

        #endregion Public Methods

        #region Private Methods

        private void UnknownAttribute(object sender, XmlAttributeEventArgs e)
        {
            _logger.LogTrace("[{0}] -> [{1}] Unexpected attribute: {2} as line {3}, column {4}. Expected attributes: {5}",
                _xmlFilePath,              // {0}
                e.ObjectBeingDeserialized, // {1}
                e.Attr.Name,               // {2}
                e.LineNumber,              // {3}
                e.LinePosition,            // {4}
                e.ExpectedAttributes       // {5}
            );
        }

        private void UnknownElement(object sender, XmlElementEventArgs e)
        {
            _logger.LogDebug("[{0}] -> [{1}] Unexpected element: {2} as line {3}, column {4}. Expected elements: {5}",
                _xmlFilePath,              // {0}
                e.ObjectBeingDeserialized, // {1}
                e.Element.Name,            // {2}
                e.LineNumber,              // {3}
                e.LinePosition,            // {4}
                e.ExpectedElements         // {5}
            );
        }

        #endregion Private Methods
    }
}