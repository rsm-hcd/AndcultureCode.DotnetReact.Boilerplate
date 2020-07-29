using AndcultureCode.CSharp.Core.Interfaces.Conductors;
using AndcultureCode.CSharp.Core.Models.Entities;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Web.Interfaces;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Interfaces
{
    /// <summary>
    /// Describes an ApiController that pertains to an Entity from the application's domain layer.
    /// </summary>
    public interface IApiEntityController<TController, TEntity> : IController
        where TController : Controller
        where TEntity : Entity
    {
        IRepositoryConductor<TEntity> Conductor { get; }
        ILogger<TController> Logger { get; }
        IMapper Mapper { get; }
    }
}
