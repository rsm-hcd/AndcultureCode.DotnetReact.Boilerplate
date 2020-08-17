using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using AndcultureCode.CSharp.Core.Constants;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.GB.Business.Core.Enumerations;
using AndcultureCode.GB.Business.Core.Models.Entities.Users;
using Core.Constants;
using Microsoft.AspNetCore.Authentication.OAuth;
using Web.Models;

namespace AndcultureCode.GB.Presentation.Web.Middleware.Authentication
{
    /// <summary>
    /// Middleware event handlers for OAuth Microsoft Accounts
    /// </summary>
    public static class OAuthMicrosoftAccountHandler
    {
        #region Public Methods

        /// <summary>
        /// OAuth 'OnCreatingTicket' Handler
        /// Executed upon a successful external login.
        /// </summary>
        public static async Task HandleCreatingTicket(OAuthCreatingTicketContext context)
        {
            var microsoftUser = await GetMicrosoftUser(context);
            var metadataConductor = context.GetDep<IRepositoryConductor<UserMetadata>>();
            var userConductor = context.GetDep<IRepositoryConductor<User>>();

            if (userConductor == null)
            {
                throw new Exception("Failed to locate User Conductor");
            }

            if (metadataConductor == null)
            {
                throw new Exception("Failed to locate Metadata Conductor");
            }



            // TODO: Look up or create user along with UserMetadata
            var userId = FindUserIdByMicrosoftUser(userConductor, metadataConductor, microsoftUser);

            Console.WriteLine("------------------");
            Console.WriteLine($"Microsoft User");
            Console.WriteLine($"GivenName: {microsoftUser.GivenName}");
            Console.WriteLine($"Email: {microsoftUser.Mail}");
            Console.WriteLine("------------------");
            Console.WriteLine("Internal User");
            Console.WriteLine($"Id: {userId}");
            Console.WriteLine("------------------");

            // TODO: Create or update cookie with our claims
            // TODO: Create UserLogin on behalf of oauth <---

            context.RunClaimActions();
        }

        #endregion Public Methods

        #region Private Methods

        private static long? FindUserIdByEmail(
            IRepositoryConductor<User> userConductor,
            MicrosoftAccountUser microsoftUser
        )
        {
            var userResult = userConductor
                .FindAll(e => e.Email == microsoftUser.Mail)
                .ThrowIfAnyErrors()
                .ResultObject;

            var id = userResult.Select(e => e.Id).FirstOrDefault();

            return id > 0 ? (long?)id : null;
        }

        private static long? FindUserIdByMetadata(
            IRepositoryConductor<UserMetadata> metadataConductor,
            MicrosoftAccountUser microsoftUser
        )
        {
            var externalIdMetadataResult = metadataConductor
                .FindAll(e =>
                    e.Name == UserMetadataName.MICROSOFT &&
                    e.Type == UserMetadataType.ExternalUserId &&
                    e.Value == microsoftUser.Id
                )
                .ThrowIfAnyErrors()
                .ResultObject;

            var userId = externalIdMetadataResult.Select(e => e.UserId).FirstOrDefault();

            return userId > 0 ? (long?)userId : null;
        }

        private static long? FindUserIdByMicrosoftUser(
            IRepositoryConductor<User> userConductor,
            IRepositoryConductor<UserMetadata> metadataConductor,
            MicrosoftAccountUser microsoftUser
        )
        {
            var userId = FindUserIdByMetadata(metadataConductor, microsoftUser);
            if (userId > 0)
            {
                return userId;
            }

            // Match on email address
            return FindUserIdByEmail(userConductor, microsoftUser);
        }

        private static T GetDep<T>(this OAuthCreatingTicketContext context) where T : class
            => context.HttpContext.Features.Get<T>(); // TODO: Extract to extension method

        private static async Task<MicrosoftAccountUser> GetMicrosoftUser(OAuthCreatingTicketContext context)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue(ContentTypes.JSON));
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);

            var response = await context.Backchannel.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, context.HttpContext.RequestAborted);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<MicrosoftAccountUser>(content, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }

        #endregion Private Methods
    }
}
