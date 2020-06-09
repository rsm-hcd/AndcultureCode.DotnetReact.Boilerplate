using AndcultureCode.CSharp.Core.Constants;
using AndcultureCode.GB.Business.Core.Interfaces.Providers.Worker;
using AndcultureCode.GB.Business.Core.Models.Entities.Worker;
using System;
using System.Linq.Expressions;


namespace AndcultureCode.GB.Business.Core.Providers.Worker
{
    public abstract class WorkerProvider : Provider, IWorkerProvider
    {
        public abstract bool Delete(string id);
        public abstract long DeletedCount();

        public abstract string Enqueue(Expression<Action> methodCall);
        public abstract string Enqueue<T>(Expression<Action<T>> methodCall);
        public abstract long EnqueuedCount(string queue = Queue.DEFAULT);

        // TODO: Not using so commenting out for now to reduce dependencies.
        // public abstract Result<IJobDetails> GetJob(string id);

        // TODO: Not using so commenting out for now to reduce dependencies.
        // public abstract Result<IRecurringJobDetails> GetRecurringJob(string id);

        public abstract void Recur(string id, Expression<Action> methodCall, RecurringOption recurringOptions);
        public abstract void Recur<T>(string id, Expression<Action<T>> methodCall, string chronExpression);
        public abstract void Recur<T>(string id, Expression<Action<T>> methodCall, RecurringOption recurringOptions);
        public abstract long RecurringCount();
        public abstract void RemoveRecurrence(string id);

        public abstract string Schedule(Expression<Action> methodCall, DateTimeOffset enqueueOn);
        public abstract string Schedule<T>(Expression<Action<T>> methodCall, DateTimeOffset enqueueOn);
        public abstract string Schedule(Expression<Action> methodCall, TimeSpan delay);
        public abstract string Schedule<T>(Expression<Action<T>> methodCall, TimeSpan delay);
    }
}
