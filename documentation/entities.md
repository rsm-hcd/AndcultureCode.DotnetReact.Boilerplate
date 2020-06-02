# Entities

Entities are the code representation of database tables.

---

## Introduction

### Entities

Entities are classes used to represent data storage in the database where one entity class maps to a single database table and a single entity instance represents a single database record.

### Migrations

This project uses a code first approach to managing the database. This means that the database schema (think database table structure) represents the code and is generated from the code with migrations. Migrations are created to enable database changes based on changes to entities. Running Dotnet's Entity Framework migration command will look for changes in the entities and then generate a migration file to make the appropriate database changes.

Creating the entity class provides a code representation of the database records, but does not create tables in the database. Before creating the migration, there are a couple more steps to complete first.

## Creating New Entities

### Location

New entities should be added in the `dotnet\api\Business\Core\Models\Entities` directory with an appropriate sub-directory based on the entity's domain. For example `User` is under the `Users` directory along with `UserLogin` and `UserRoles`. Most sub-directory will contain only a single entity.

### Naming

Entities should be named as singular nouns while database tables should be named as plural nouns. For example, the `User` entity maps to the `Users` database table. Names with multiple words should be combined in CamelCase, for example `UserRoles`.

### Class Structure

Entity classes should be properly namespaced and should also contain regions to organize the class. Notice the `Properties` and `Navigation Properties` regions in the example.

```csharp
namespace GB.Business.Core.Models.Entities.Users
{
    public class User : Auditable
    {
        #region Properties

        public string EmailAddress { get; set; }
        public string UserName     { get; set; }

        #endregion Properties


        #region Navigation Properties

        public List<UserRole> UserRoles { get; set; }

        #endregion Navigation Properties
    }
}
```

### Auditable

Most entities inherit should inherit from the `Auditable` class which is included as part of the [AndcultureCode.CSharp.Core](https://github.com/AndcultureCode/AndcultureCode.CSharp.Core) package. The `Auditable` class adds a number of fields to track when entity records are created, updated, and deleted.

```csharp
namespace AndcultureCode.CSharp.Core.Models
{
    public abstract class Auditable : Entity, IAuditable, ICreatable, IDeletable, IUpdatable
    {
        protected Auditable();

        public long?            CreatedById { get; set; }
        public DateTimeOffset?  CreatedOn   { get; set; }
        public long?            DeletedById { get; set; }
        public DateTimeOffset?  DeletedOn   { get; set; }
        public long?            UpdatedById { get; set; }
        public DateTimeOffset?  UpdatedOn   { get; set; }
    }
}
```

## Registering Entities

After creating the entity class, new entities need to be registered in several places. This section shows the necessary steps to setup an entity.

#### Context Interface

Entities need to be added to the Context Interface found at `dotnet\api\Business\Core\Interfaces\Data\IGravityBootsContext.cs`.

**Make sure that the property name is plural. i.e. Users**

```csharp
public interface IGravityBootsContext
{
    IQueryable<User> Users { get; }
}
```

#### Context Implementation

After adding entities to the context interface, entities need to be added to the Context class implementation found in `dotnet\api\Infrastructure\Data.SqlServer\GravityBootsContext.cs`. The following items should be added.

##### DbSet

Entities are registered as a `DbSet` with the type being the entity name and the properties being declared as the pluralized entity name. These properties are necessary for database migrations and define the mapping between entity name and database table name. For example, the `User` entity and `Users` table.

```csharp
#region Properties

public DbSet<User> Users { get; set; }

#endregion Properties
```

##### Context Implementation

The context implementation will map the ICodeApiContext to the GravityBootsContext implementation.

```csharp
#region IGravityBootsContextImplementation

IQueryable<User> IGravityBootsContext.Users => Users;

#endregion IGravityBootsContextImplementation
```

##### Entity Validation Mappings

Mappings can be added to register entities to validation maps. The map classes contain validation logic for properties on the entity. Mappings are added as part of the `ConfigureMappings` method. Each domain should have it's own commented section (i.e. Roles and Users in the example below). Naming should combine the entity name with map. For example the `User` entity has a `UserMap`.

Validation map files should be added for entities. See [Entity Validation](#entity-validation) for more information.

```csharp
public override void ConfigureMappings(ModelBuilder modelBuilder)
{
    // Roles
    modelBuilder.AddMapping(new RoleMap());

    // Users
    modelBuilder.AddMapping(new UserMap());

    base.ConfigureMappings(modelBuilder);
}
```

##### Soft Delete Filter

Entities will be soft deleted, meaning that database records for an entity will not be removed from the database, but instead the `DeletedOn` property will be set to the date and time the entity was deleted. In order to ensure that deleted records are not returned when finding entities, each entity should have the `AddSoftDeletedFilter` filter applied. This is done in the `OnModelCreateing` method as shown in the example.

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    AddSoftDeletionFilter<User>(modelBuilder);

    base.OnModelCreating(modelBuilder);
}
```

## Creating Migrations

After the setup found in [DbSet](#dbset) is complete, a migration may be created.

#### Migration Naming

Migrations should be named based on an action and entity.

Examples Include:

-   `CreateJobs` - Create the jobs table.
-   `AddFieldToJobs` - Add a new field to the jobs table.
-   `UpdateFieldToTypeInJobs` - Change the field type in the jobs table.

### Generating Migration Files

_Before creating a new migration, make to register the entity first. See the [DbSet](#dbset) section._

Migrations can be created, deleted, executed or reverted through the `and-cli migration` command from the root of the repository.

```bash
and-cli migration --add AddDescriptionFieldToChapter
```

Running the `and-cli migration --add` command will compare the current entities with the database schema in `GravityBootsContextModalSnapshot.cs`. Any changes between the two will be reflected in migrations file which describes how the database will need to be changed to reflect the new entity structure. Migrations can be found in the `Infrastructure/Data.SqlServer/Migrations/` directory.

Migrations should be created for each entity change. For instance, it's generally not a good idea to add a new entity and change an existing entity in a single migration. There are exceptions to this rule.

_Note: Make sure to check the generated migration file to ensure that the migration matches expections. The cli command should remind you of this after running._

### Deleting Migration Files

If you generated a migration and there's something wrong with it - maybe it's empty, or contains more changes than you intended, you can safely delete it with the `and-cli migration --delete` command **if you haven't already executed the migration on your database.** For example:

```bash
bscot@BSCOTT-PC ~/gb/ (misc/update-documentation) -> git status
On branch misc/update-documentation
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   dotnet/api/Business/Core/Models/Entities/Chapters/Chapter.cs
        modified:   dotnet/api/Infrastructure/Data.SqlServer/Migrations/GravityBootsContextModelSnapshot.cs

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        dotnet/api/Infrastructure/Data.SqlServer/Migrations/20200116125720_AddDescriptionFieldToChapter.Designer.cs
        dotnet/api/Infrastructure/Data.SqlServer/Migrations/20200116125720_AddDescriptionFieldToChapter.cs
```

There are two untracked files and a pending modification for `GravityBootsContextModelSnapshot.cs`.

You undo this change through the `and-cli migration --delete` command. This will use `dotnet ef` under the hood to remove the migration.

_Note: this command will only remove the most recent migration. If you have more than 1 pending migration, it will remove the more recent one._

### Reverting a Migration

If you've generated _and_ executed a migration on your database that you need to undo, you'll need to revert it before you can delete the files. This will prevent your database from getting out of sync from the code-first migrations.

Let's say you have 5 applied migrations in your database, from oldest to newest.

```
20191217200320_AddLabelColumnToSection
20200102204425_CreateBlogPost
20200103162241_CreateArticlesAndParts
20200106203229_AddExternalIdToBlogPost
20200116133848_AddDescriptionFieldToChapter
```

If you want to revert just `20200116133848_AddDescriptionFieldToChapter`, you need to use the `and-cli migration --run` command with the migration directly before it, which is `20200106203229_AddExternalIdToBlogPost`, ie:

```bash
and-cli migration --run AddExternalIdToBlogPost
```

You can verify this reverted the migration by running a select on your `__EFMigrationsHistory` table:

```sql
SELECT * FROM __EFMigrationsHistory
```

## Entity Validation

Map files provide a method for validating data before creating or updating entity records in the database. Mapping files are stored in `dotnet\api\Infrastructure\Data.SqlServer\Maps\`. Sub-directions should be created per entity domain (look to the entity directory structure for guidance). Map file names should include the entity name and the word "Map". For example, `UserMap`. An example Mapping file is shown below.

```csharp
public class UserMap : Map<User>
{
    public override void Configure(EntityTypeBuilder<User> entity)
    {
        entity
            .Property(e => e.EmailAddress)
            .IsRequired();

        entity
            .Property(e => e.UserName)
            .IsRequired();
    }
}
```
