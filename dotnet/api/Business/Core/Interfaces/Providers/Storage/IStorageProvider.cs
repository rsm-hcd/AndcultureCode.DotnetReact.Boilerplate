using System;
using System.IO;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.GB.Business.Core.Enumerations;

namespace AndcultureCode.GB.Business.Core.Interfaces.Providers.Storage
{
    public interface IStorageProvider
    {
        /// <summary>
        /// Copies a file or folder from a source location on the external storage provider to a
        /// destination location on the external storage provider.
        /// </summary>
        /// <param name="srcRelativeProviderPath">Name of the 'prefix' or relative path under the source bucket to copy data from</param>
        /// <param name="srcStorageContainer">Name of the source bucket/container from which to pull data from</param>
        /// <param name="destRelativeProviderPath">Name of the 'prefix' or relative path under the destination bucket to copy data to</param>
        /// <param name="destStorageContainer">Name of the destination bucket/container from which to copy data to</param>
        /// <param name="srcPathToCopy">
        /// (Optional) Name of the individual file underneath the source bucket and relative path.
        /// If omitted, it is assumed you are copying a folder instead of an individual file.
        /// </param>
        /// <param name="destPathToCopy">
        /// (Optional) Name of the individual file underneath the destination bucket and relative path.
        /// If omitted, it is assumed you are copying a folder instead of an individual file.
        /// </param>
        /// <returns>True if the copy operation succeeded, false otherwise.</returns>
        IResult<bool> Copy(
            string srcRelativeProviderPath,
            string srcStorageContainer,
            string destRelativeProviderPath,
            string destStorageContainer,
            string srcPathToCopy = null,
            string destPathToCopy = null
        );

        /// <summary>
        /// Downloads and saves file from external storage to local machine
        /// </summary>
        /// <param name="relativeProviderPath">Path to file respective to the parent folder/bucket</param>
        /// <param name="storageContainer">Parent level folder/bucket</param>
        /// <param name="pathToSave">Path on local system to save file</param>
        IResult<bool> Download(string relativeProviderPath, string storageContainer, string pathToSave);

        /// <summary>
        /// Check existence of a file stored externally
        /// </summary>
        /// <param name="relativeProviderPath">Path to file respective to the parent folder/bucket</param>
        /// <param name="storageContainer">Parent level folder/bucket</param>
        IResult<bool> FileExists(string relativeProviderPath, string storageContainer = null);

        /// <summary>
        /// Get's file contents from storage provider
        /// </summary>
        /// <param name="relativeProviderPath">Path to file respective to the parent folder/bucket</param>
        /// <param name="storageContainer">Parent level folder/bucket</param>
        IResult<string> GetFile(string relativeProviderPath, string storageContainer = null);

        /// <summary>
        /// Get resource RemoteAccessDetails
        /// </summary>
        /// <param name="relativeProviderPath">Path to file respective to the parent folder/bucket</param>
        /// <param name="storageContainer">Parent level folder/bucket</param>
        /// <param name="expiryTime">Life span before exipiration</param>
        /// <param name="httpVerb">The Http verb of requested action</param>
        /// <param name="contentType">Content-Type of requested resource</param>
        IResult<IRemoteAccessDetails> GetRemoteAccessDetails(
            string relativeProviderPath,
            string storageContainer = null,
            DateTimeOffset? expiryTime = null,
            HttpVerb httpVerb = HttpVerb.GET,
            string contentType = null
        );
    }
}