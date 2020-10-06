# Authentication

The application supports three modes of authentication

-   Cookie (Enabled by default)
-   Google OAuth (Disabled by default)
    -   Set `Authentication:Google:IsEnabled` in `appsettings.json` to `true`
    -   Uncomment Google option in `new-userlogin-page.tsx`
-   Microsoft OAuth (Disabled by default)
    -   Set `Authentication:Microsoft:IsEnabled` in `appsettings.json` to `true`
    -   Uncomment Microsoft option in `new-userlogin-page.tsx`

Please follow the instructions below to configure the OpenID provider accounts.

**DO NOT** add any Client IDs or Secrets to source control.

---

## Environment Configuration

### Development

For development machines, we leverage [User Secret Manager](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-3.1&tabs=windows)

```shell
dotnet user-secrets set "Authentication:Google:ClientId" "<App Registration / Client ID>"
dotnet user-secrets set "Authentication:Google:ClientSecret" "<App Registration / Client Secret>"

dotnet user-secrets set "Authentication:Microsoft:ClientId" "<App Registration / Client ID>"
dotnet user-secrets set "Authentication:Microsoft:ClientSecret" "<App Registration / Client Secret>"
```

### Hosting Environments

Environment variables should be considered within each environment's hosting configuration.

Again, **DO NOT** add these details into any of the `appsettings.*.json` files in source control.

---

## Open ID Account Setup

### Google

-   Go to [application credentials page](https://console.developers.google.com/apis/credentials)
-   Create new project
-   Configure consent screen with details about application
-   User Type: Internal (scopes to andculture/client organization -- like azure ad)
-   Create OAuth Client ID
    -   Type: Web application
    -   Name: Something description (ie. gravityboots api)
    -   Javascript origin URIs: https://localhost:5001
    -   Redirect URIs: https://localhost:5001/signin-google

### Microsoft

-   Create microsoft account
-   Create application registration for application (gravityboots-working)
    -   Search for 'App Registrations' in search of Azure Portal
-   Configure redirect-url
    -   Platform type: Web
    -   Redirect URL: https://localhost:5001/signin-microsoft
    -   Logout URL: https://localhost:5001/signout-microsoft
-   Configure as multi-tenant application
    -   Supported account types
        -   Select radio button of “Accounts in any organizational directory (Any Azure AD directory - Multitenant)”
