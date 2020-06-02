using AndcultureCode.CSharp.Testing.Factories;
using Bogus;
using AndcultureCode.GB.Business.Core.Models.Jobs;

namespace AndcultureCode.GB.Testing.Factories.Models.Entities.Jobs
{
    public class JobFactory : Factory
    {
        public override void Define()
        {
            var faker = new Faker();
            this.DefineFactory(() => new Job
            {
                BackgroundJobId = faker.Random.Guid().ToString(),
                WorkerName = faker.Name.JobTitle()
            });
        }
    }
}