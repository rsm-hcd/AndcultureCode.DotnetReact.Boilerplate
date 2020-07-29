using System.Collections.Generic;
using AndcultureCode.CSharp.Core.Models.Entities;
using AndcultureCode.GB.Presentation.Web.Controllers.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AndcultureCode.GB.Presentation.Web.Controllers.Web.Extensions
{
    public static class IApiEntityControllerExtensions
    {
        #region HTTP GET

        /// <summary>
        /// Conventional Get(long id) controller method functionality
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="id"></param>
        /// <typeparam name="TController"></typeparam>
        /// <typeparam name="TEntity"></typeparam>
        /// <typeparam name="TDto"></typeparam>
        /// <returns></returns>
        public static IActionResult GetDefault<TController, TEntity, TDto>(
            this IApiEntityController<TController, TEntity> controller,
            long id
        )
            where TController : Controller
            where TEntity : Entity
        {
            var readResult = controller.Conductor.FindById(id);
            if (readResult.HasErrors)
            {
                return controller.InternalError<TDto>(readResult.Errors, controller.Logger);
            }

            var resource = readResult.ResultObject;
            if (resource == null)
            {
                return controller.NotFound<TDto>();
            }

            return controller.Ok(controller.Mapper.Map<TDto>(resource), null);
        }

        /// <summary>
        /// Conventional Index() controller method functionality
        /// </summary>
        /// <param name="controller"></param>
        /// <typeparam name="TController"></typeparam>
        /// <typeparam name="TEntity"></typeparam>
        /// <typeparam name="TDto"></typeparam>
        /// <returns></returns>
        public static IActionResult IndexDefault<TController, TEntity, TDto>(
            this IApiEntityController<TController, TEntity> controller
        )
            where TController : Controller
            where TEntity : Entity
        {
            var readResult = controller.Conductor.FindAll();
            if (readResult.HasErrors)
            {
                return controller.InternalError<List<TDto>>(readResult.Errors, controller.Logger);
            }

            var resources = readResult.ResultObject;
            var dtos = controller.Mapper.Map<List<TDto>>(resources);

            return controller.Ok(dtos, errors: null);
        }

        #endregion HTTP GET
    }
}
