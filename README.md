# La Quatre

## Install & run

This is a [Vite project](https://vite.dev/), configured with React and Typescript, and [Vitest](https://vitest.dev/) for unit tests.

To install, from the root of the project,

- Make sure you are using the correct node version: `nvm install` ([nvm](https://github.com/nvm-sh/nvm)).
- Install dependencies: `yarn install # do not use npm`.
- And configure the development env vars in `.env`, based on `.env.dist`. Ask a friendly looking collegue for API keys.

To run the dev server,

- Run `yarn dev`.

To perform a production build,

- Run `yarn build`.

For other scripts (linting, type-checking, unit testing...), see `package.json`.

## Overview

### Styles

- The project uses plain modern CSS.
- Currently, it uses a simple two file system, with generic styles in `index.css` and app styles in `App.css`. CSS modules or an equivalent may be preferable, should the SPWA grow.

### Project layout

The project layout reflects how simple the project is, so

- Directly in the `src/` folder lie all entrypoints and files that are globally meaningful.
- Separate React components are in `src/components`.

Besides,

- Unit test files live beside the file they cover, following the `TestedFile.test.ts(x)` convention.
- If a file needs exportable types, it will come with a `File.types.ts` counterpart.

# DEFAULT DOCUMENTATION: React + TypeScript + Vite (TODO)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
