# Internationalization / Localization

---

## Backend

### Developer workflow

While you should read all documentation contained in this file to best understand internationalization (i18n)
and localization (l10n), here is the cliff notes version of how it will impact the majority of your
development.

1. Add new error key string constant to your given class (ie. conductor, controller, etc...)
    ```csharp
    public const string ERROR_WORKER_NOT_FOUND
            = "JobEnqueueConductor.ValidateWorkerFromType.WorkerNotFound";
    ```
2. Add new error message to my assembly's json files. So if I would have en-US and es-ES, I'd do the following...
    ```json
    // File: Cultures/AndcultureCode.GB.Business.Conductors.en-US.json
    [
        {
            "Key": "JobEnqueueConductor.ValidateWorkerFromType.WorkerNotFound",
            "Value": "The Worker could not be determined from the supplied type {0}."
        }
    ]
    ```
    - Add duplicate key and value pair to other language files. Currently, simply tossing the
      translation into google translate will work for testing purposes. That or, just leave value as
      and empty string.
    - When we fully release i18n/l10n for Gravity Boots we will have these JSON files translated by professionals.
    ```json
    // File: Cultures/AndcultureCode.GB.Business.Conductors.es-ES.json
    [
        {
            "Key": "JobEnqueueConductor.ValidateWorkerFromType.WorkerNotFound",
            "Value": "No se pudo determinar el trabajador a partir del tipo suministrado {0}."
        }
    ]
    ```
3. Dependency inject `IStringLocalizer`

    ```csharp
    using Microsoft.Extensions.Localization;

    public MyConductor(IStringLocalizer localizer) { _localizer = localizer; }
    ```

4. When adding the error to the `IResult<T>`, no longer hard-code the message.
    ```csharp
    r.AddError(_localizer, ERROR_WORKER_NOT_FOUND, workerType.Name);
    ```

Be pragmatic, while in an ideal world ALL text would be translated, please be realistic. If something
is a system-level or admin use only message, let it just go in the native/default language (english).

### Translation cultures/files

When the application is built, each assembly copies its `Cultures/*.json` files to the output
directory. If you look at the Presentation.Web project's bin directory you'll see a full
list of all the assemblies' culture files.

Each assembly will provide its own culture JSON files. While the file names of the json files
_can_ be whatever you want, they must be unique and the recommended pattern is to prefix them
with the assembly name. The application will verify and throw an exception if there are duplicate
translation files and/ or keys loaded across all the files in the `Cultures` directory.

For example, Business.Core would be...

```
Cultures/AndcultureCode.GB.Business.Core.en-US.json
Cultures/AndcultureCode.GB.Business.Core.es-ES.json
```

A given translation file is simply an array of key/value pairs

```json
[
    {
        "Key": "ERROR_INVALID_USERNAME",
        "Value": "Your username '{0}' is invalid."
    }
]
```

The majority of the time, translation keys will be unique (ie. `JobEnqueueConductor.ValidateWorkerFromType.WorkerNotFound`).
That said, the actual mechanism that loads these translations allows for sharing and even overriding
of keys.

For instance, if we wanted to have an AndcultureCode.CSharp.Cultures file with shared translations,
this model would allow us to bundle shared translations and throughout our application we could
add strings and have them translated without the need to redundantly copy them to our assembly.

### IStringLocalizer

When needing to get the translation for a given translation key, simply inject the
`Microsoft.Extensions.Localization.IStringLocalizer` interface in your class constructor.

From there you can get the correct translation for the current request by providing the key...

```csharp
using Microsoft.Extensions.Localization;

public MyClass(IStringLocalizer localizer)
{
    _localizer = localizer;
}

public MyMethod(string userName)
{
    Console.WriteLine($"{_localizer[ERROR_INVALID_USERNAME, userName]);
}
```

`IStringLocalizer` takes the key followed by optional object array `object[]` of arguments used to
format the translation string.

### IResultExtensions

There have been a variety of convenience extension methods added to IResultExtensions that now
accept `IStringLocalizer` and optional formatting variables (ie. think `String.Format`). While
adding localization, they remove the need to pass a message being they are now loaded from the
culture JSON files.

### Fluent Validators (Web/Validators)

Fluent validators come with localization support out of the box. As long as you leverage
built-in features as much as possible, it will come for "free".

Please read the (documentation)[https://docs.fluentvalidation.net/en/latest/localization.html] to
ensure you are following best practices when writing validators.

Best practices of note:

-   Avoid use of redundant validation calls
    -   Example: `NotEmpty()` also handled `NotNull()`
    -   So, you do `.NotNull().NotEmpty()` you'll get two validation errors in the list

### Setting up an assembly for localization

1. Add a 'Cultures' directory
2. Add culture translation files for the assembly
    - `Namespace.For.My.Assembly.{culture}.json`
    - `AndcultureCode.GB.Business.Core.en-US.json`
3. Add translation pairs in the following format
    ```json
    [
        {
            "Key": "MY_ERROR_KEY.ForSomeClass.ForSomeMethod",
            "Value": "Class of type {0} is experiencing an error in method {1}"
        }
    ]
    ```
    - If no current translations just add an empty array `[]` as the contents for the `.json` files
4. Update your projects `.csproj` to contain the following ItemGroup
    ```xml
    <ItemGroup>
        <Content Include="Cultures\*.json">
            <CopyToOutputDirectory>Always</CopyToOutputDirectory>
        </Content>
    </ItemGroup>
    ```

### API Controllers

All API routes now have an optional `{culture}` routing constraint all consumers to provide the
culture/locale (ie. es-ES). To make this easy for developers, there is a new attribute you decorate
your controller classes with called `ApiRoute`.

This attribute does several things

1. It wraps native Route attribute that we were using before
2. Saves the need to redundantly add `/api/v{x}` in our routes
3. Saves the need for us to manually add the `{culture}` constraint to all routes
4. Allows us to globally manipulate routes for the application in a single place now.

Base-line HTTP response types should do translations for you (ie. NotFound).

#### Retrieving current locale

There is a getter property on base Controller called `CurrentCulture` for us to program against
should we need to programmatically use the locale.
