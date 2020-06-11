# AndcultureCode.DotnetReact.Boilerplate [![Build Status](https://travis-ci.org/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate.svg?branch=master)](https://travis-ci.org/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate) [![codecov](https://codecov.io/gh/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/branch/master/graph/badge.svg)](https://codecov.io/gh/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate)

# AndcultureCode.DotnetReact.Boilerplate

Code name: Gravity Boots (GB)

---

## Getting Started

### Technologies

-   Dotnet Core 3.1
-   Node 8.16
-   NPM 6
-   React 16.11
-   SQL Server 2017+
-   TypeScript 3.7

### Development Setup

#### 1. Databases

##### SqlServer 2017 (Pending approval: could be PostgreSQL)

1. Install [Microsoft SQL Server 2017](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

2. Create the following databases

    - Development: `GravityBootsApi` (See [appsettings.json](./dotnet/api/Presentation/Web/appsettings.json) for details.)
    - Test: `GravityBootsApi-Test` (See [appsettings.cli.json](./dotnet/api/Presentation/Cli/appsettings.cli.json) for details.)

3. Configure user.
    - Get credentials from the `appsettings.json` file listed above.
    - Right click on Security, then select New > Login
        - Add login name
        - Select SQL Server authentication
            - Add password
            - Deselect Enforce password policy and Enforce password expiration
    - Select Server Roles from Select a Page
        - Local development: Select all
    - Select User Mapping from Select a Page
        - For both the development and test databases:
            - Local development: Select all role memberships

#### 2. Backend: Dotnet Core CSharp

Install [Dotnet Core 3.1 SDK & Runtime](https://dotnet.microsoft.com/download/dotnet-core/3.1)

#### 3. Frontend: React TypeScript

Install [NodeJS 8.16 / NPM 6](https://nodejs.org/dist/latest-v8.x/node-v8.16.1-x64.msi)

#### 4. CLI

There is a central `and-cli` used to manage builds, tests, deployments, etc... for the various aspects of the project.

Install the `and-cli` tooling found at [AndcultureCode.Cli](https://github.com/AndcultureCode/AndcultureCode.Cli)

Below are a few basics to get you started, but there are many more commands and options for managing this and other projects found in the `and-cli`.

-   `and-cli dotnet --restore` - restore the dotnet solution
-   `and-cli dotnet` - running backend project
-   `and-cli dotnet-test --by-project` - running backend automated tests
-   `and-cli dotnet -- --cli test db migrate` - migrate the test database (Clean and Restore the project before running. Done with: `and-cli dotnet -cRb`)
-   `and-cli migration --add MigrationName` - generates an EF Core database migration based on code-first changes
-   `and-cli migration --run MigrationName` - runs (or reverts to) a specified EF Core database migration
-   `and-cli webpack` - running frontend
-   `and-cli webpack-test` - running frontend tests
-   `and-cli webpack --restore` - restore npm dependencies for frontend
-   `npm run all-tests` - runs all of the test suites (backend, functional, frontend) and runs a storybook build (run from the root of the repo)
-   `cd frontend && npm run cypress:open` - run functional test suite interactively
-   `cd frontend && npm run cypress:open:working` - run functional test suite interactively against working
-   `cd frontend && npm run cypress:run` - run functional test suite headlessly
-   `cd frontend && npm run cypress:run:working` - run functional test suite headlessly
-   `cd frontend && npm run test:debug` - starts web socket connection for easy editor independent interactive debugging https://create-react-app.dev/docs/debugging-tests/

## Documentation

### Engineering Documentation

_Engineering Documentation_ covers the codebase (i.e. patterns, style, and best practices), software development, building, and deploying the project.

-   [Architecture](./documentation/onion-architecture.md)
-   [Background Jobs: Hangfire](./documentation/hangfire.md)
-   [Caching](./documentation/caching.md)
-   [Code Conventions](./documentation/code-conventions.md)
-   [Entities](./documentation/entities.md)
-   [Frontend Architecture](./documentation/frontend-architecture.md)
-   [Git Workflow](./documentation/git-workflow.md)
-   [Hangfire](./documentation/hangfire.md)
-   [Shared Background Job Engine](./documentation/job-engine.md)
-   [Storybook / KOP](./documentation/storybook.md)
-   [Swagger Documentation](./documentation/caching.md)

### External Resources

_External Resources_ cover requirements, high level architecture, design, and project management for the project.

-   [API Documentation](https://localhost:5001/api/docs)
-   [JIRA](https://andculture.atlassian.net/jira/software/projects/GB/boards/301)

### Adding Documentation

-   Here is our [documentation style guide and template](./documentation/documentation-style-guide-and-template.md) to get started.
-   Documentation should be written with Markdown and should have the `.md` extension. Bitbucket has a [Markdown Syntax Guide](https://confluence.atlassian.com/bitbucketserver/markdown-syntax-guide-776639995.html) for reference.
-   For information on writing docs, go to [Write the Docs](https://www.writethedocs.org/).
