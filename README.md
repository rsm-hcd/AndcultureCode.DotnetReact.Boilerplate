# AndcultureCode.DotnetReact.Boilerplate

![build status](https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/actions/workflows/build.yaml/badge.svg)[![codecov](https://codecov.io/gh/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/branch/main/graph/badge.svg)](https://codecov.io/gh/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate)<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Code name: Gravity Boots (GB)

---

## Getting Started

### Technologies

-   Dotnet 5
-   Node 8.16
-   NPM 6
-   React 16.13
-   SQL Server 2017+
-   TypeScript 3.8
-   Docker (Unit Tests Only)

### Development Setup

#### 1. Databases

##### SqlServer 2017 (Pending approval: could be PostgreSQL)

1. Install [Microsoft SQL Server 2017](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

2. Create the following database

    - Development: `GravityBootsApi` (See [appsettings.json](./dotnet/api/Presentation/Web/appsettings.json) for details.)

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

Install [Dotnet Core 5.0.14 SDK & Runtime](https://dotnet.microsoft.com/en-us/download/dotnet/5.0)

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

## 5. Getting Started

Restore the dotnet packages (first time only)

    and-cli dotnet --restore

Restore the NPM node modules (first time only)

    and-cli webpack --restore

Start the dotnet server

    and-cli dotnet

Start the webpack server

    and-cli webpack

Open your browser and navigate to:

    https://localhost:5001

## 6. Unit Tests

In order to run tests in a CI environment, the database is spun up in an Docker container using the latest mssql image from docker hub.
You will need to [install Docker](https://docs.docker.com/get-docker/), (Docker Desktop on Windows), and ensure the engine is running prior to running all unit tests.
The database fixture will pull the image, if it doesn't exist, and start the container. Each collection gets a separate container. Once finished, the containers are automatically cleaned up.

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://winton.me"><img src="https://avatars.githubusercontent.com/u/48424?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Winton DeShong</b></sub></a><br /><a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/commits?author=wintondeshong" title="Code">💻</a> <a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/commits?author=wintondeshong" title="Tests">⚠️</a> <a href="#maintenance-wintondeshong" title="Maintenance">🚧</a> <a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/pulls?q=is%3Apr+reviewed-by%3Awintondeshong" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/brandongregoryscott"><img src="https://avatars.githubusercontent.com/u/11774799?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brandon Scott</b></sub></a><br /><a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/commits?author=brandongregoryscott" title="Code">💻</a> <a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/commits?author=brandongregoryscott" title="Tests">⚠️</a> <a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/pulls?q=is%3Apr+reviewed-by%3Abrandongregoryscott" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://resume.dylanjustice.com"><img src="https://avatars.githubusercontent.com/u/22502365?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dylan Justice</b></sub></a><br /><a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/commits?author=dylanjustice" title="Code">💻</a> <a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/commits?author=dylanjustice" title="Tests">⚠️</a> <a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/pulls?q=is%3Apr+reviewed-by%3Adylanjustice" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/Stefanie899"><img src="https://avatars.githubusercontent.com/u/37462028?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stefanie Leitch</b></sub></a><br /><a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/commits?author=Stefanie899" title="Code">💻</a> <a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/pulls?q=is%3Apr+reviewed-by%3AStefanie899" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/AndcultureCode/AndcultureCode.DotnetReact.Boilerplate/commits?author=Stefanie899" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
