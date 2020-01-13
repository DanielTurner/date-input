# \<date-input>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
  npm i git+ssh://git@github.com:DanielTurner/date-input.git#master#v{version},
```

## Usage
```html
<script type="module">
  import 'date-input/date-input.js';
</script>

<date-input></date-input>
```

## Linting with ESLint, Prettier, and Types
To scan the project for linting errors, run
```bash
npm run lint
```

You can lint with ESLint and Prettier individually as well
```bash
npm run lint:eslint
```
```bash
npm run lint:prettier
```

To automatically fix many linting errors, run
```bash
npm run format
```

You can format using ESLint and Prettier individually as well
```bash
npm run format:eslint
```
```bash
npm run format:prettier
```

## Local Demo with `es-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`

```bash
npm start:compatibility
```
To run a local development server in compatibility mode for older browsers that serves the basic demo located in `demo/index.html`

## CSS Variables available.
* font: var(--picker-font, 'Arial');
* background-color: var(--calendar-background, #F2F2F2);
* border-width: var(--calendar-borderwidth, 1px);
* border-style: var(--calendar-borderstyle, solid);
* border-color: var(--calendar-border-color, #808080);
* background-color: var(--day-background, #EDEDED);
* color: var(--day-foreground, #333333);
* font-size: var(--day-fontsize, 14px);
* border-width: var(--calendar-borderwidth, 1px);
* border-style: var(--calendar-borderstyle, solid);
* border-color: var(--calendar-border-color, #808080);
* background-color: var(--date-background);
* color: var(--date--foreground, 333333);
* font-size: var(--date-fontsize, 14px);
* border-width: var(--calendar-borderwidth, 1px);
* border-style: var(--calendar-borderstyle, solid);
* border-color: var(--calendar-border-color, #808080);
* opacity: var(--sprite-opacity, 0.5);