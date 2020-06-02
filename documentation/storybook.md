# Storybook

Storybook provides a tool to view, organize, and test React components in isolation.

See [Storybook Docs](https://storybook.js.org/docs/basics/introduction/) for more detailed information.

---

## Introduction

### What is Storybook and why use it?

React is a component based library where all UI elements in React are either a basic HTML element or a combination of React components. Storybook provides tooling to view React application components in isolation from the React app in a design pattern library. Storybook helps with documentation, design standards, and understanding component functionality.

## Development and Deployment

### Local Development

To use Storybook start by running `npm install`. This can be done from the project's root directory with:

```bash
$ npm run frontend-install
```

Storybook comes with a development server to be run locally.

```bash
$ npm run storybook
```

For deployment, Storybook builds to a static site in `./frontend/storybook-static/` by default. In our case, being we are running routing first through our backend application, we set the `-o` to publish to `/wwwroot/kop` so you can see the `kop` output while running the application at `/kop/index.html`.

```bash
$ npm run build-storybook
```

### Deployment

Storybook has been deployed to AWS S3 and routed through our dotnet application. All pushed branches will trigger builds and notify Slack when the build has begun.

## How to Write a Story

**Note:** Stories will be written in the [Component Story Format](https://storybook.js.org/docs/formats/component-story-format/), the newest story format introduced in Storybook 5.2. This format allows stories to be written as ES6 modules.

### Story Placement and Naming

Stories will be placed in the same folder as the related component. They should have the `*.stories.tsx` extension added to the name of the component.

Example Folder Structure:

```
frontend\src\atoms\forms\input-text.tsx
frontend\src\atoms\forms\input-text.stories.tsx
```

### Story Default Export

Every story must have a `default` export that contains metadata for the story. The `title` field denotes the story hierarchy shown in the Storybook navigation menu. The format for the title should be `<Atom Design Building Block> | <Domain> / <Component Name>`. The `component` field contains the story's React component.

#### Example Default Export

```typescript
export default {
    title: "Atoms | Forms / Input Text",
    component: InputText,
};
```

### Story Naming

Stories should be written as ES6 modules with the `const` name representing the name shown in the Storybook navigation. In most cases the name can simply be the name of the component with "Default" added to the end. If various versions of a story need to be shown, the `const` name should describe those variations. For example, `inputTextDefault` and `inputTextKnobs`. Storybook will change the camel case variable name to something that is human readable.

### Basic Stories

Stories just need to return something that can be rendered to the screen. The example below returns a basic React component. In this case only required `props` have been passed into the component with other `props` using default or remaining `null`.

#### Example Basic Story

```typescript
export const inputTextDefault = () => <InputText placeholder="Placeholder" />;
```

### Stories with Knobs

The Knobs addon has been added to allow interaction with component `props` from within Storybook. Knobs adds a "Knobs" tabs inside the Storybook Panel where controls can be added to manipulate the component's props based on factors defined in the story.

Knobs controls are created by passing a "knob" to the component's props from the story. For instance, for the `placeholder` `prop` shown below the `prop` receives the `text` knob with a `label` and `defaultValue`. The `label` should be the name of the `prop`.

#### Example Story with Knobs

```typescript
export const inputTextKnobs = () => (
    <InputText
        disabled={boolean("disabled", false)}
        maxLength={number("maxLength", 20)}
        placeholder={text("placeholder", "Placeholder")}
    />
);
```

## Organization

### Atomic Design

Storybook will be organized based on [Atomic Design](http://atomicdesign.bradfrost.com/chapter-2/) principles. React components will be organized as follows:

-   Particles - Design tokens including fonts, font sizes, colors, borders, etc. This will likely be handled by the [Storybook Design Token Addon](https://github.com/UX-and-I/storybook-design-token).
-   Atoms - Foundational building blocks including [basic HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element).
-   Molecules - Simple UI combinations of atoms that function as a unit.
-   Organisms - Complex UI combinations of atoms, molecules, or other organisms.
-   Templates - Pages layouts with Atoms, Molecules, and Organisms to show content structure.
-   Pages - Templates with real content to show design variations and to test the design system.

## Future Enhancements

There are a number of Storybook [Addons](https://storybook.js.org/addons/) that could prove to be helpful in the future. They can be added at a later date as we have specific use cases.

-   [Viewport](https://github.com/storybookjs/storybook/tree/master/addons/viewport) - For testing responsive designs.
-   [a11y](https://github.com/storybookjs/storybook/tree/master/addons/a11y) - Accessibility checker.
-   [Info](https://github.com/storybookjs/storybook/tree/master/addons/info) - This on is already in use, but could be used in the future for adding additional information to each story.
-   [Notes](https://github.com/storybookjs/storybook/tree/master/addons/notes) - For documenting stories.
-   [Storybook Design Token](https://github.com/UX-and-I/storybook-design-token) - To document design tokens.

## Additional Resources

-   [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/)
-   [Extending Atomic Design](http://bradfrost.com/blog/post/extending-atomic-design/)
-   [Katia Sittmann: Thinking About React, Atomically](https://blog.usejournal.com/thinking-about-react-atomically-608c865d2262)
-   [Brad Frost: Thinking About React, Atomically](http://bradfrost.com/blog/link/thinking-about-react-atomically/)
