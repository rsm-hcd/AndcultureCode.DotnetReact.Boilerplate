# Shared Background Job Engine

Describes Shared Background Job Engine.

---

## Introduction

For tasks that need to be completed outside of an API request or for
long-running tasks (i.e. sending email or importing large files), background
jobs are used to run these tasks.

The Shared Background Job Engine helps to manage background jobs by capturing
metadata about the job and it's status. This metadata can be used to view
errors, provide debugging data, show jobs status, and find outstanding jobs
in the queue.

## Hangfire

Hangfire is the background job processing engine currently used in the Gravity Boots
API. This could be changed in the future has necessary. Hangfire handles
running, processing, and scheduling background jobs. Our Shared Background
Job engine helps to capture information about the work being done by
Hangfire.

### Failed Jobs

In order for Hangfire to recognize that a job has failed, the job's code must
throw an exception. The `Worker`'s `Execute` method handle throwing
exceptions when the job has failed as long as the `Action` method throws
exceptions when necessary (the exception needs to bubble up to `Execute`).

## Shared Background Job Engine

The Shared Background Job Engine provides several components.

### Job Entity

The Job entity stores metadata about the jobs in the queue. More detail can
be found in the [Job
entity](../dotnet/api/Business/Core/Models/Entities/Jobs/Job.cs).

Jobs can be referenced by Hangfire's `JobId` which is stored as
`BackgroundJobId` on the Job entity. This value is helpful to cross reference
jobs between the two systems.

### Workers

Worker classes are the heart of the Shared Background Job engine. Every
background job in the system should be defined as a Worker class. Worker
classes should implement `IWorker` and also inherit from the `Worker` class.

Workers should have one property, `Name`, and two methods, `Action` and
`Execute`.

### Worker Name Property

The `Name` property defines the unique identifier for the Worker. No Worker
should have the same `Name` property value. `Name` is stored in the
`WorkerName` property on the Job entity and used when jobs are executed to
find the correct Worker class to be executed. Using the `Name` property
instead of the class or interface name, allows the Worker interface or
implementation to change without without breaking the job.

### Worker Execute Method

The `Execute` method has been implemented on the parent `Worker` class. In
most cases, `Execute` will be the entry point for running the worker and
should be called from the `JobEnqueueConductor`. This method is responsible
for managing the status of the Job and updating Job metadata as the job runs.
`Execute` will call the `Action` method, as well as handle any responses or
errors from `Action`.

### Worker Action Method

The `Action` method will be called by `Execute`. It's job is to perform the
work for the Worker and should have unique implementations for each Worker.
`Action` should throw an exception is the job cannot be completed, but should
not be wrapped in the Do/Try pattern.

## Job States

A job can have four distinct states: initial state, in progress, errorred,
and completed. The initial state denotes a job that has been enqueued, but
work has not begun (i.e. the `Execute` method has not been called). The in
progress state denotes a job that is actively running. A failed job will be
set to errored, while a successful job will be set to completed.

The Job entity has several methods to manage moving between state:
`SetToInitialState`, `SetToInProgress`, `SetToErrored`, `SetToCompelted`, and
`ResetToInitialState`.
