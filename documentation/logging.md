# Logging

Logging is done through Serilog.

-   [Serilog](https://serilog.net)

---

## Introduction

Examples of using logging errors within the Gravity Boots API.

### Local Development

Logs are written locally to a Logs dir.

### AWS Logging Pipeline

Each EC2 instance creates it's own logs. Those logs are periodically rotated to S3 storage. EC2 logging configuration/setup is done though .ebextensions configs. On the EC2 instance a dir `C:\inetpub\logs\AppLogs` is created with proper permissions for IIS_IUSRS to write the logs to.

### Configuration

At a high-level Serilog is configured to write logs via file logging via the WriteTo/path property. From there, Amazon beanstalk is configured to look in that location to tail and rotate the logs as well as rotate/stream those contents to S3 or CloudWatch.

Configuration set in `appsettings.json` and/or `appsettings.<ENV_NAME>.json` respectively via the `Serilog` property.

Below is documentation on project specific and/or non-conventional settings.

```json
"Serilog": {
  "WriteTo": [
    {
      "Args": {
        // Property: path
        // Serilog adds rotation value before the last period '.'
        // Elastic beanstalk reads rotation after the first period '.'
        "path": "C:\\inetpub\\logs\\AppLogs\\gb-api..txt"
      },
      "Name": "File",
    }
  ]
}
```

### Calling the Logger

Log writing conventions:

-   [Serilog - Writing Log Events](https://github.com/serilog/serilog/wiki/Writing-Log-Events)

Instantiating the Logger and logging an error using recommended templating:

```csharp
using Microsoft.Extensions.Logging;

ILogger<Foo> _logger;

public Foo(ILogger<Foo> logger)
{
  _logger = logger;
}

public void Bar()
{
  _logger.LogInformation("Hello, World!");
}

public void FooBar()
{
  _logger.LogError("Oh no!");
}
```

Outputs to log (File and/or Console): `LAPTOP-J3537EQ1 2019-11-11 13:06:11.581 -05:00 [INF] [gb-api] [AndcultureCode.GB.Business.Conductors.Foo] Hello World!`

Can log different Log Event Levels (`Debug`, `Information`, `Warning`, `Error`, `Fatal`):

### Controllers

Returning an `InternalError` logs the reason for the error.

```csharp
public IActionResult Index()
{
    var readResult = _userReadConductor.FindAll();
    if (readResult.HasErrors)
    {
        // THIS WILL LOG THE ERROR
        return InternalError<UserDto>(null, readResult.Errors, logger);
    }

    return Ok(_mapper.Map<List<UserDto>>(readResult.ResultObject), null);
}
```

# Strategy

## Logging Levels

Logging levels allow us to put a log message into one of several buckets, sorted by urgency. This way we can filter messages by urgency.
Out of the box, Serilog provides us with the following categorization of logged events.

-   Verbose
    -   _What it means_: Anything and everything you might want to know about a running block of code.
    -   _When to use it_: This should rarely (if ever) be enabled in production. It is for tracing the start or end of a method, processing durations, and endpoints that have been called.
-   Debug
    -   _What it means_: Internal system events that aren't necessarily observable from the outside
    -   _When to use it_: Log any information that helps us identify what went wrong. Debug level logs could include error messages when an incoming HTTP request was malformed and resulted in a 400 response.
-   Information
    -   _What it means_: FYIs. Maybe helpful, maybe not.
    -   _When to use it_: When documenting state changes in the application, or an entity within the application. Information level logs help use to understand what is actually happening in the system. Useful information to log is startup parameters, creation of entities, status changes, completion of batch processes.
-   Warning
    -   _What it means_: Service is degraded or endangered. Something bad happened, but the application has a chance to recover, or the issue can wait to be fixed. The Warning level should be active in production by default, and alerts should be put in place.
    -   _When to use it_: A system failed to connect to an external resource, but will try again automatically, or similar.
-   Error
    -   _What it means_: Functionality is unavailable, invariants are broken or data is lost. Users are being affected without having a way to work around the issue.
    -   _When to use it_: An unhandled exception in the application, an Internal Error is returned. For example, _Cannot insert record due to duplicate key violation._
-   Fatal
    -   _What it means_: The application is _really_ in trouble. It's so bad, _John Wick_ came out of retirement.
    -   _When to use it_: Only to be used in circumstances that call for immediate attention. This logging level should be reserved for when a valuable use case cannot be completed due to technical issues, or a bug. For example, _Out of disk space_ or other data loss scenarios.

## CloudWatch Logs

In order to make use of querying and viewing logs, we centralize our logs on Amazon CloudWatch Logs. CloudWatch provides features for filtering and querying logs by specific fields, regardless of the source.

Applications hosted on EC2 instances will use CloudWatch to monitor systems. We can track the number of errors that occur in the application logs and send a notification when the rate of errors exceeds a specified threshhold.

Logs will be retained for 30 days in production and 14 days in any non-production environmnent.

## Log Category

The use of `ILogger<TCategoryName>` will be used to identify the location of the logged event.
Most logging providers will allow for a message output template that can display event properties.
At a minimum, we will be providing the timestamp, the three letter code for the log level, the exception message, fully qualified class name and stack trace.
The output of the logs should follow the following template.
`{MachineName} {Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{Application}] [{SourceContext}] {Message:lj}{NewLine}{Exception}{NewLine}`

```
2019-10-14 16:59:23.419 -04:00 [ERR] Exception occurred in ErrorsConductor
Object reference not set to instance of an object in
AndcultureCode.GB.Business.Conductors.ErrorsConductor

```
