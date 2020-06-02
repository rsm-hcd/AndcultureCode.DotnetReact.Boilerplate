# Caching

Outlines the configuration and use of caching in the backend API

See the following resources for more in-depth details:

-   [Common Features: WebApi Caching](http://anthonygiretti.com/2018/12/17/common-features-in-asp-net-core-2-2-webapi-caching/)
-   [Response Caching Middleware in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/performance/caching/middleware?view=aspnetcore-3.0)

---

## Introduction

For the backend application we are currently leveraging ASP.NET Core's conventional ResponseCaching package `Microsoft.AspNetCore.ResponseCaching`.

Caching will be opt-in only as to avoid unexpected side-effects that often come with caching. In an effort to not prematurely optimize we should not jump to caching unless we are 100% confident it is safe.

The primary initial use case will be endpoints that are heavily used by the frontend web applications on startup. Commonly these things are common system types that feed form drop downs that while they might be database and admin driven, they can be cached for even a small amount of time to alleviate load.

---

### Storage

At this time, we are starting out with in-memory caching until we determine the amount of caching or performance is in-adequate. At a later date for caching and/or background job queueing we might determine it useful to use a DistributedCache with Redis (or what-have-you).

### Configuring an API Controller or Endpoint

The `ResponseCache` attribute can be applied at the controller class or method level.

```csharp
// Cache for 10 seconds
[ResponseCache(Duration = 10, Location = ResponseCacheLocation.Any)]
[HttpGet]
public IActionResult Index() { /* ... */ }
```

As the use of caching increases, common durations/configuration may emerge based on business rules. In those cases, CacheProfiles should be used...

```csharp
// Startup.cs

// Simple 10 second caching
options.CacheProfiles.Add(CacheProfiles.DEFAULT10, new CacheProfile
{
    Duration = 10
});

// "Never" cache profile
options.CacheProfiles.Add(CacheProfiles.NEVER, new CacheProfile
{
    Location = ResponseCacheLocation.None,
    NoStore  = true
});

```

### Client Application Best Practices

The response caching middleware does not force the client to cache the request. If the client requires it, the conventional caching headers can be provided to ensure the server is not caching.

`Cache-Control: no-cache`

For more fine-grained control, see [Response caching in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/performance/caching/response?view=aspnetcore-3.0)
