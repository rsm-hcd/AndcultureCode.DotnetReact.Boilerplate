# Hangfire

Discussion of Hangfire implementation

**Note:** This project is using a [Share Background Job Engine](./job-engine.md) to manage background jobs. Please refer to that documentation when creating background jobs.

---

## Introduction

[Hangfire](hangfire.io) is an open source background job processing service for .NET applications.
Our implementation uses SQL Server to persist background jobs to safely ensure jobs are run regardless of the application pool cycle. Jobs can be viewed in the built in web interface, and logging is processed through the application's logging provider. (Serilog -- Coming Soon!).

## Configuration

Configuration for the service can be found at `dotnet\api\Infrastructure\Workers.Hangfire\Utilities\Configuration.cs`
Individual settings can be configured in `appsettings.json`

-   `IsDashboardEnabled`: true (default),
-   `IsServerEnabled`: true (default),
-   `Password`: "" (default),
-   `Queues`: ["default"](default),
-   `SqlServerOptions` (Hangfire `SqlServerStorageOptions`)
    -   `CommandBatchMaxTimeout`: 5 Minutes (default)
    -   `SlidingInvisibilityTimeout`: 5 minutes (default)
    -   `QueuePollInterval`: 0 (default)
    -   `UseRecommendedIsolationLevel`: true (default)
    -   `UsePageLocksOnDequeue`: true (default)
    -   `DisableGlobalLocks`: true (default)
-   `Ssl`: false (default),
-   `WorkerCount`: "4" (default),

## Usage

_Adapted hangfire.io/overview.html_

The `IWorkerProvider` interface was created to provide an abstraction of the default Hangfire Job functions to leverage dependency injection. The implementation of those methods has been created in the `AndcultureCode.GB.Infrastructure.Workers.Hangfire.Providers.HangfireWorkerProvider`.

```
private readonly IWorkerProvider _workerProvider;

public Constructor(IWorkerProvider workerProvider)
{
    _workerProvider = workerProvider;
}

```

### Fire and Forget

```
var jobId = _workerProvider.Enqueue(
    () => Console.WriteLine("Fire-and-forget!"));
```

### Delayed

```
var jobId = _workerProvider.Schedule(
    () => Console.WriteLine("Delayed!"),
    TimeSpan.FromDays(7));
```

### Recurring

```
string JOB_ID = "JobName.ActionName";
var options = new RecurringOption();
_workerProvider.Recur(JOB_ID,
    () => Console.WriteLine("Recurring!"),
    options);
```

### Delete

```
string JOB_ID = "JobName.ActionName";
_workerProvider.Delete(JOB_ID);
```
