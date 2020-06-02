# Swagger - Swashbuckle

Swagger tooling for API's built with ASP.NET Core. Generate beautiful API documentation, including a UI to explore and test operations, directly from your routes, controllers and models.

-   [Swagger Swashbuckle Docs](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)

## Introduction

Swagger will automatically document any API controller endpoint.

## Usage

Parameters are picked up from the route annotation or `[FromBody]`.

### Controller Examples

```c#
/// <summary>
/// Get's all Users in the system
/// </summary>
/// <returns>List of UserDtos</returns>
/// <response code="200">List of UserDtos</response>
/// <response code="500">Error Getting Users</response>
[HttpGet]
[ProducesResponseType(200, Type = typeof(IList<UserDto>))]
public IActionResult Index() {}

/// <summary>
/// Get's a single User
/// </summary>
/// <param name="id"></param>
/// <returns>Requested UserDto</returns>
/// <response code="200">Requested UserDto</response>
/// <response code="500">Error Getting User</response>
[HttpGet("{id}")]
[ProducesResponseType(200, Type = typeof(UserDto))]
public IActionResult Index(long id) {}
```

```c#
/// <summary>
/// Create a new User
/// </summary>
/// <remarks>
/// Sample request:
///
///     POST /UserDto
///     {
///        "EmailAddress": "user@email.com",
///        "UserName":     "gb_user"
///     }
///
/// </remarks>
/// <param name="user"></param>
/// <returns>Newly created UserDto</returns>
/// <response code="201">Newly created UserDto</response>
/// <response code="400">Invalid UserDto</response>
/// <response code="500">Error Creating User</response>
[HttpPost]
[ProducesResponseType(201, Type = typeof(UserDto))]
[ProducesResponseType(400)]
[ProducesResponseType(500)]
public IActionResult Create([FromBody] UserDto user) {}
```

```c#
/// <summary>
/// Updates a User record
/// </summary>
/// <remarks>
/// Sample request:
///
///     POST /UserDto
///     {
///        "EmailAddress": "user@email.com",
///        "UserName":     "gb_user"
///     }
///
/// </remarks>
/// <param name="id"></param>
/// <param name="user"></param>
/// <returns>Update success status</returns>
/// <response code="200">Update successful</response>
/// <response code="500">Error Updating User</response>
[HttpPut("{id}")]
public IActionResult Update(long id, [FromBody] UserDto user) {}
```

### Model Examples

```c#
public class UserDto : AuditableDto
{
    /// <summary>The Users Email Address</summary>
    public string EmailAddress { get; set; }

    /// <summary>The Users Login Name</summary>
    public string UserName     { get; set; }
}
```

### Modifying Swagger Schemas

Swagger will attempt to read all models and generate a schema automatically. If a schema needs to be modified you can modify them with SchemaFilters.

-   Create a SchemaFilter:

```c#
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
```

-   Register the filter is Startup.cs:

```c#
services.AddSwaggerGen(c =>
{
    ...

    c.SchemaFilter<AuditableSchemaFilter>();
});
```
