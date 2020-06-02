using System;
using System.Linq;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace AndcultureCode.GB.Presentation.Web.Models.Dtos
{
    /// <summary>
    /// Sets properties to readonly so Swagger-UI ignores them for post/put requests
    /// </summary>
    public class AuditableSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (schema.Properties != null)
            {
                var auditableProperties =
                        new AuditableDto()
                            .GetType()
                            .GetProperties()
                            .Where(a => a.CanRead)
                            .Select(a => a.Name.ToLower());

                foreach (var p in schema.Properties)
                {
                    var property = p.Key.ToLower();
                    if (!auditableProperties.Contains(property))
                    {
                        continue;
                    }

                    p.Value.ReadOnly = true;
                }
            }
        }
    }
}
