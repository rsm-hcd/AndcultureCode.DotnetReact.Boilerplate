using AndcultureCode.CSharp.Core.Interfaces;
using MimeKit;
using AndcultureCode.GB.Business.Core.Interfaces.Providers.Mail;
using AndcultureCode.GB.Business.Core.Providers;

namespace AndcultureCode.GB.Business.Core.Models.Mail
{
    public abstract class EmailProviderBase : Provider, IEmailProvider
    {
        #region Implementation of IEmailProvider

        public abstract IResult<bool> Send(MimeMessage message);
        public abstract IResult<bool> SendLater(MimeMessage message);

        #endregion
    }
}
