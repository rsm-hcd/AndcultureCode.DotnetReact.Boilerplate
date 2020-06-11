using System;
using System.Collections.Generic;
using System.Linq;
using AndcultureCode.CSharp.Core.Extensions;
using AndcultureCode.CSharp.Core.Interfaces;
using AndcultureCode.CSharp.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using AndcultureCode.GB.Business.Core.Interfaces.Conductors.Jobs;
using AndcultureCode.GB.Business.Core.Interfaces.Workers;
using AndcultureCode.GB.Business.Core.Models.Jobs;
using AndcultureCode.GB.Business.Core.Models.Security;
using AndcultureCode.GB.Presentation.Web.Attributes;
using AndcultureCode.GB.Presentation.Web.Models.Dtos.Jobs;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Api.V1.Jobs
{
    [FormatFilter]
    [ApiRoute("jobs")]
    public class JobsController : ApiController
    {
        #region Private Members

        readonly IEnumerable<IWorker> _workers;
        readonly IJobEnqueueConductor _jobEnqueueConductor;
        readonly IMapper _mapper;

        #endregion

        #region Constructor

        public JobsController(
            IStringLocalizer localizer,
            IEnumerable<IWorker> workers,
            IJobEnqueueConductor jobEnqueueConductor,
            IMapper mapper
        ) : base(localizer)
        {
            _workers = workers;
            _jobEnqueueConductor = jobEnqueueConductor;
            _mapper = mapper;
        }

        #endregion

        #region Post

        [HttpPost]
        [ProducesResponseType(201, Type = typeof(JobDto))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [AclAuthorize(AclStrings.JOBS_CREATE)]
        public IActionResult Create([FromBody] JobDto dto)
        {
            if (_workers.IsEmpty())
            {
                return NotFound<JobDto>();
            }

            var worker = _workers.ToList().Find((e) => e.Name == dto.WorkerName);
            if (worker == null)
            {
                return NotFound<JobDto>();
            }

            var workerType = worker.GetType();

            List<object> workerArgs = new List<object>();
            try
            {
                workerArgs = JsonConvert.DeserializeObject<List<Object>>(dto.WorkerArgs);
            }
            catch
            {
                return BadRequest<JobDto>(
                    null,
                    "ERROR_WORKER_ARGS_COULD_NOT_BE_DESERIALIZED",
                    $"Worker Args {dto.WorkerArgs} could not be deserialized."
                );
            }

            var jobEnqueueResult = (IResult<Job>)_jobEnqueueConductor
                .GetType()
                .GetMethods()
                .First((e) => e.Name == "Enqueue" && e.IsGenericMethod)
                .MakeGenericMethod(workerType)
                .Invoke(_jobEnqueueConductor, new Object[] { workerArgs, null });

            if (jobEnqueueResult.HasErrorsOrResultIsNull())
            {
                return BadRequest<JobDto>(null, jobEnqueueResult?.Errors);
            }

            return Created(_mapper.Map<JobDto>(jobEnqueueResult.ResultObject));
        }

        #endregion Post
    }
}
