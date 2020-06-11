using AndcultureCode.CSharp.Core.Interfaces.Providers.Storage;

namespace AndcultureCode.GB.Business.Core.Models.Storage
{
    public class RemoteAccessDetails : IRemoteAccessDetails
    {
        public string Url { get; set; }
    }
}