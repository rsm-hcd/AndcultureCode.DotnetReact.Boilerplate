# Frontend Architecture

Discussion of Frontend React Application's architecture.

---

## Introduction

The frontend application (TypeScript and React) uses Atomic Design and ITCSS (Inverted Triangle CSS) to organize the codebase. Atomic design provides common chemistry terms to define classifications of components from atomics and molecules up through to the page itself. ITCSS provides a pyramid of layers to minimize common issues with global namespacing, cascading or selector specificity.

## Resources

-   [Thinking About React, Atomically](https://blog.usejournal.com/thinking-about-react-atomically-608c865d2262)
    -   Great resources to reference for rampup (starter)
-   [Atomic Design Methodology: Chapter Two](http://atomicdesign.bradfrost.com/chapter-2/)
    -   Great resource to reference for rampup (intermediate)
-   [ARc Git Repository](https://github.com/diegohaz/arc/tree/master/src-example)
-   [ITCSS: Scalable and Maintainable CSS Architecture](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)

---

## Goals

Before getting into the weeds of each specific technology or pattern comprising the frontend architecture, it is important that we establish high-level goals.

-   Well-maintained routing table
-   Maintain community best practices
-   Don't let the designs dictate terms used in code

---

## State Management

Use as much of core React as possible. Leverage context, hooks and function components. While there might be a future abstraction
we leverage, these simple actors are going to be used as a global state solution.

To extend global state, add new properties to the `GlobalState` interface and `GlobalStateRecord`. Using record and view-model pattern, convenience methods can hang directly off of `GlobalStateRecord` for easy use throughout the application.

```TSX
// MyComponent.tsx

import GlobalStateContext, { useGlobalState } from "utilities/contexts/global-state-context";

const [globalStateRecord] = useGlobalState(GlobalStateContext);

console.log(globalStateRecord.isAuthenticated());

```

Additionally, the setter can be used to update global state for re-evaluation system wide.

```TSX

import GlobalStateContext, { useGlobalState } from "utilities/contexts/global-state-context";

const [globalStateRecord, setGlobalState] = useGlobalState(GlobalStateContext);

setGlobalState(globalStateRecord.with({ currentUser: newUserRecord }));

```

---

## Routing

Our frontend routing needs to have the same level of design thinking as our API routing scheme. We should strive to have our baseline routing mirror our data model before deviating.

When requiring a "pretty url", still provide the standard route...

-   Standard: `/books/{:id}` (ie. `/books/10`)
-   Permalink: `/books/{:permalink}` (ie. `/books/myst`)

All too common frontend routing falls into a trap of creating clever names based upon mock-ups/designs. The issue is that they change frequently. When a new component of a route/url is added, developers should step back and see if it is on a list of commonly used terms, entities, etc... This goes for the actual actions of the system (ie. If you are doing a `clone` in one part of the system, it shouldn't be called `duplicate` by code in another).

Developers should strive to create unique routes for the various actions of the system. Even if an action is driven by a modal.

-   Book listing: `/books`
-   Book detail: `/books/{:id}`
-   Book creation: `/books/new`
-   Book deletion: `/books/{:id}/delete`
-   Book edit: `/book/{:id}/edit`

Using routing as a guide to structure pages and their components takes the guess work out of finding components. You should simply remove the ids to find the folder path.

-   Route: `/books/{:book-id}/sections/{:id}`
-   Folder: `/pages/books/sections/section.tsx`

---

## Atomic Design

Below are the terms from atomic design with important points to keep in mind when writing their components.

To maintain community best practices, while particles is a cool extension of Atomic, we should not rename existing Atomic, ITCSS or other established terms based upon this home-brewed concept. While we can use the term 'Particle' in storybook on the frontend, it should not influence the actual actors in code.

### Atoms

-   Ideally pure functional component (PFC)
-   Styling: written without margins or positions
-   Once has multiple components, promote it a molecule

### Molecules

-   Try to keep as PFCs as well
-   Data gathering
-   Styling: Can set position of atoms
-   Styling: Cannot have margin or position
-   Most of the time (not always), once has logic/state/hooks, move to organisms

### Organisms

-   Data gathering
-   Styling: Can set position of atoms
-   Styling: Cannot have margin or position

### Templates

-   Business-logic
-   Data gathering
-   Only a single function
-   Only sets grid of pages, but never positions of specific components

### Pages

-   Business-logic
-   Data gathering
-   Organize by route!
-   Limit yourself to 4 nested page levels deep (design away from going deeper)
-   Renders the specific components with its template

---

## ITCSS

### Settings

Used with preprocessors and contain font, colors definitions, etc.

### Tools

Globally used mixins and functions. It’s important not to output any CSS in the first 2 layers.

-   tools/
    -   functions/
    -   mixins/

### Generic

Reset and/or normalize styles, box-sizing definition, etc. This is the first layer which generates actual CSS.

### Elements

Styling for bare HTML elements (like H1, A, etc.). These come with default styling from the browser so we can redefine them here.

### Objects

Class-based selectors which define undecorated design patterns, for example media object known from OOCSS.

### Components

Specific UI components. This is where the majority of our work takes place and our UI components are often composed of Objects and Components

When married with Atomic design, these UI components are further organized by atomically

-   components/
    -   atoms/
    -   molecules/
    -   organisms/
    -   pages/
    -   templates/

### Utilities

Utilities and helper classes with ability to override anything which goes before in the triangle, eg. hide helper class

---

## Webpack & React

The frontend application is leveraging the out-of-the-box verison of create-react-app. We will strive to leverage the non-ejected create-react-app for as long as possible. There are numerous benefits to leveraging its means of extensibility as opposed to ejecting and customizing it.

The decision to eject needs to be well-thoughtout and not taken lightly.

### Folder structure

-   `assets/`
    -   `fonts/`
    -   `icons/`
    -   `images/`
    -   `scss/`
        -   `0-vendor/`
        -   `1-settings/` (aka particles)
        -   `2-tools/`
            -   `functions/`
            -   `mixins/`
        -   `3-generic/`
        -   `4-elements/`
        -   `5-objects/`
        -   `6-components/`
            -   `atoms/`
            -   `molecules/`
            -   `organisms/`
            -   `pages/`
            -   `templates/`
        -   `7-utilities/`
-   `atoms/` (aka elements)
-   `models/` (always top-level)
    -   `interfaces/` (generated and custom model interfaces)
    -   `services/` (generated and custom services - implementation TBD)
    -   `view-models/` (generated and custom Immutable Records)
-   `molecules/` (aka blocks)
-   `organisms/` (aka compositions)
-   `pages/` (aka modules) - Could code-split
    -   `{:pageName}/` (ie. `books/`)
        -   `organisms/` - Could be page specific organisms. Atoms, molecules should be kept global.
        -   `sections/` - Sub-pages follow routing from here. No need for `pages/sections/`
            -   `section.tsx` - Detail view (route: `/books/{:book-id}/sections/{:id}`)
            -   `sections.tsx` - Listing view (route: `/books/{:book-id}/sections`)
            -   ...
        -   `book.tsx` - Detail view (route: `/books/{:id}`)
        -   `books.tsx` - Listing view (route: `/books`)
        -   `delete-book.tsx` - Delete view (route: `/books/{:id}/delete`)
        -   `edit-book.tsx` - Edit view (route: `/books/{:id}/edit`)
        -   `new-book.tsx` - Create view (route: `/books/{:id}/new`)
-   `templates/` (aka layouts)
    -   `application-layout.tsx`
    -   `detail-layout.tsx`
    -   `listing-layout.tsx`
    -   `book-detail-layout.tsx` - Layouts should be consolidated and not prematurely nested
-   `tests/` - Testing related configuration/tools
-   `utilities/` (ie. CoreUtils)

---

## Automated Testing

### Factories

Similar to the backend test factories, we are using [Rosie](https://github.com/rosiejs/rosie), which is a library inspired by factory_girl.

To create a new factory:

1. Add your new factory into `src/tests/factories` directory

```TSX
import { Factory } from "rosie";
import User from "models/interfaces/user";
import FactoryType from "tests/factories/factory-type";

const userFactory = Factory.define<User>(FactoryType.user)
    .sequence("email", (i) => `testemail${i}@email.com`)
    .sequence("externalIdentifier", (i) => `external-id-${i}`)
    .sequence("userName", (i) => `testuser${i}`);

export default userFactory;
```

2. Register your factory into `src/tests/factories/index.ts` so it gets loaded upon test startup.

```TSX
import userFactory from "tests/factories/user-factory";

/**
 * Being factories are registered and referenced loosely, we must
 * export via an index so they get loaded via the build.
 */

export { userFactory };
```

3. Now you can leverage the factory in your test arrangements

```TSX
import { Factory } from "rosie";
import FactoryType from "tests/factories/factory-type";

// ...

// Arrange
const user = Factory.build<User>(FactoryType.user);
```

### Unit testing

Library: [Jest](https://jestjs.io/)

The goal is to write unit tests for all javascript code that isn't a react component leveraging Jest.

Test fixtures will be in parallel to the system-under-test.

-   `/path/to/file.ts`
-   `/path/to/file.test.ts`

### Integration testing

Libraries:

-   [React Testing Library](https://github.com/testing-library/react-testing-library)
-   [Jest Fetch Mock](https://github.com/jefflau/jest-fetch-mock)
    -   [Using Jest Fetch Mock with CRA](https://www.npmjs.com/package/jest-fetch-mock#using-with-create-react-app)

Instead of spending time writing integration tests with shallow dom rendering techniques and/or writing
tests heavily dependant on the underlying code being introspected, we will write outside-in
integration tests from the perspective of the user.

#### React Components leveraging Axios (XHR) API requests

Using React testing to write our tests and conventional create-react-app mocking to stub in API requests.

Below is an example demonstrating use of mocking API requests with Jest as well as integration testing a page component with React Test Library.

Example:

```TSX
// books.tsx
import React, { useState, useEffect } from "react";
import { List }                       from "immutable";
import { api }                        from "routes";
import { BookRecord }                 from "models/view-models/book-record";
import { Book }                       from "models/interfaces/book";

const BooksPage: React.FC<BooksPageProps> = (props: BooksPageProps) => {

    const [books, setBooks] = useState(List<BookRecord>());
    const [booksLoaded, setBooksLoaded] = useState(false);
    const { list: getBooksApi } = BookService.useList();
    const { handlePageLoadError, pageErrors } = usePageErrors();

    useEffect(async () => {
        if (booksLoaded) {
            return;
        }

        try {
            const response = await getBooksApi();
            setBooks(response.resultObjects);
            setBooksLoaded(true);
        } catch (result) {
            handlePageLoadError(result);
        }
    }, [getBooksApi]);

    return (
        <React.Fragment>
            <h2>Books</h2>
            <ul>
                { // if
                    books.map((book, i) => {
                        return <li key = {i}>{book.title}</li>;
                    })
                }
            </ul>
        </React.Fragment>
    );
}

// books.test.tsx
import { Book }         from "models/interfaces/book";
import { render, wait } from "@testing-library/react";
import BooksPage        from "pages/books/books";
import React            from "react";
import mockAxios        from "tests/mocks/mock-axios";
import { Factory }      from "rosie";
import FactoryType      from "tests/factories/factory-type";

describe("BookPage", () => {

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("can view list of books", async () => {
        // Arrange
        const book1         = Factory.build<Book>(FactoryType.book);
        const book2         = Factory.build<Book>(FactoryType.book);
        const books: Book[] = [ book1, book2 ];

        mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: {
                    resultObject: books,
                },
            })
        );

        // Act
        const { getByText } = render(<BooksPage />);

        // Assert
        await wait(() => {
            expect(getByText(book1.title!)).toBeInTheDocument();
            expect(getByText(book2.title!)).toBeInTheDocument();
        });
    });

});
```

#### React Components leveraging fetch API requests

While mocking axios (XHR) requests will be the most common scenario, given that is used by our services, there could
be cases where a library leverages fetch and it would also need mocked.

Using React testing to write our tests and Jest fetch mock to stub in API requests globally.

Below is an example demonstrating use of mocking API requests with Jest Fetch Mock as well as integration testing a page component with React Test Library.

Example:

```TSX
// books.tsx
import React, { useState, useEffect } from "react";
import { List }                       from "immutable";
import { api }                        from "routes";
import { BookRecord }                 from "models/view-models/book-record";
import { Book }                       from "models/interfaces/book";

const BooksPage: React.FC<BooksPageProps> = (props: BooksPageProps) => {

    const [books, setBooks]             = useState(List<BookRecord>());
    const [booksLoaded, setBooksLoaded] = useState(false);

    useEffect(() => {
        if (booksLoaded) {
            return;
        }

        fetch(api.books.index)
            .then((r) => r.json())
            .then((r) => {
                setBooks(r.resultObject.map((b: Book) => new BookRecord(b)));
                setBooksLoaded(true);
            });
    });

    return (
        <React.Fragment>
            <h2>Books</h2>
            <ul>
                { // if
                    books.map((book, i) => {
                        return <li key = {i}>{book.title}</li>;
                    })
                }
            </ul>
        </React.Fragment>
    );
}

// books.test.tsx
import { Book }         from "models/interfaces/book";
import { render, wait } from "@testing-library/react";
import BooksPage        from "pages/books/books";
import React            from "react";
import { Factory }      from "rosie";
import FactoryType      from "tests/factories/factory-type";

describe("BookPage", () => {

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test("can view list of books", async () => {
        // Arrange
        const books = Factory.buildList(FactoryType.book, 2) as Book[];

        fetchMock.mockResponseOnce(JSON.stringify({ resultObject: books }));

        // Act
        const { getByText } = render(<BooksPage />);

        // Assert
        await wait(() => {
            expect(getByText(book1.title!)).toBeInTheDocument();
            expect(getByText(book2.title!)).toBeInTheDocument();
        });
    });

});
```

### Functional/e2e Testing

Library: [Cypress](https://www.cypress.io/)

#### Why do we functionally test?

To further minimize possible regressions, we are employing cypress for programatically functional testing of the frontend.
These tests are run in an actual browser, simulating the user's level of interaction with the application.

While we may later find it worth while to write some full end-to-end tests from frontend to backend,
to keep these tests cheaper to write, easier to maintain and maintaining the maximum value per test, we are mocking
API responses from the server.

#### What do we test?

##### Pages

-   Every page should have a success scenario render test
-   As many functional paths as pragmatically possible (weighing in time to write & run test, fragility of test, value return of test, etc...)

##### Mission-Critical Flows

These are user flows that cut across many pages and functions to perform a common and important
path in the system.

Example A: User change password - Visit login, Login, Navigate to change password, Enter details, Submit and redirect
Example B: Navigate book content - Login, Select book, Select Chapter, Select Section, Render content

##### Heavily shared components

As the system evolves certain components will likely become key actors used across the system and configured in a variety of ways.
Components that are frequently shared should have extra attention given to coverage. A very common scenario is extending
a component for a new scenario, not to realize you regressed functionality of that component in an entirely differnt
used area of the application.

#### TODO

There are various improvements which will organically happen as the team writes tests. Here are a few areas of improvement to keep in mind...

-   TypeScript Support
-   Simulating commonly used browser breakpoints (ie. resize browser and re-run)
-   Mission-critical paths worth testing frontend to backend (use sparingly)
-   Cross-browser support
    -   This is dependent on [Cypress's roadmap](https://github.com/cypress-io/cypress/issues/310), but ultimately it will be beneficial to run the functional suite across multiple browsers. Right now Cypress only supports chrome variants.
-   Generating API related fixtures automatically

#### Example

```TSX
// cypress/integration/pages/userlogins/new-userlogins.spec.js

describe("User Logins", () => {
    describe("#new", () => {
        const newUserLoginRoute = "/userlogins/new";
        const userDashboardRoute = "/dashboards/user";
        const formClassName = (selector) => {
            const className = ".c-userlogin-new-form";
            return selector == null ? className : `${className} ${selector}`;
        };

        whenAuthenticated(() => {
            it("it redirects to user dashboard", () => {
                // Act
                cy.visit(newUserLoginRoute);

                // Assert
                urlShouldEqual(userDashboardRoute);
            });
        }); // end when authenticated

        whenUnauthenticated(() => {
            it("renders the page", () => {
                // Arrange
                cy.visit(newUserLoginRoute);

                // Assert
                cy.get(formClassName());
            });

            it("when user logs in successfully, redirects to user dashboard", () => {
                // Arrange
                cy.visit(newUserLoginRoute);

                cy.server();
                cy.route(
                    "POST",
                    apiUrl("userlogins"),
                    "fixture:api/userlogins/create-success.json"
                );

                cy.get(formClassName(selectTestId("userName"))).type(
                    "testuser@example.com"
                );

                cy.get(formClassName(selectTestId("password"))).type("12345");

                // Act
                cy.get(formClassName("form")).submit();

                // Assert
                urlShouldEqual(userDashboardRoute);
            });
        }); // end when unauthenticated
    }); // end #new
}); // end User Logins
```
