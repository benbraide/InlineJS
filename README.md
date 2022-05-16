# InlineJS

[![npm (scoped)](https://img.shields.io/npm/v/@benbraide/inlinejs.svg)](https://www.npmjs.com/package/@benbraide/inlinejs) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@benbraide/inlinejs.svg)](https://www.npmjs.com/package/@benbraide/inlinejs)

Run javascript code by embedding them in your HTML using the element as context.

InlineJS is component-based spin-off to [Alpine.js]([https://github.com/alpinejs/alpine](https://github.com/alpinejs/alpine)).

Like `Alpine.js`, it works without creating shadow DOMs.

## Install

 - Grab source or distribution versions from `GitHub`
 - Include script in your HTML file.
## NPM Install

```
npm install @benbraide/inlinejs
```

## Initialization
```js
import { BootstrapAndAttach } from  '@benbraide/inlinejs/bootstrap/attach';

BootstrapAndAttach();
```
>`BootstrapAndAttach` takes an optional DOM element to search. Defaults to the document element.

## Usage

*Dropdown/Modal*
```html
<div x-data="{ open: false }">
    <button x-on:click="open = true">Open Dropdown</button>
    <div x-show="open" x-on:click.outside="open = false">
        Dropdown Body
    </div>
</div>
```

*Tabs*
```html
<div x-data="{ tab: 'foo' }">
    <button x-class:active="tab === 'foo'" x-on:click="tab = 'foo'">Foo</button>
    <button x-class:active="tab === 'bar'" x-on:click="tab = 'bar'">Bar</button>

    <div x-show="tab === 'foo'">Tab Foo</div>
    <div x-show="tab === 'bar'">Tab Bar</div>
</div>
```

You can even use it for non-trivial things:
*Pre-fetching a dropdown's HTML content on hover*
```html
<div x-data="{ open: false, html: 'Loading Spinner...' }">
    <button
        x-on:mouseenter.once="html = $fetch('/dropdown-partial.html')"
        x-on:click="open = true"
    >Show Dropdown</button>

    <div x-show="open" x-html="html" x-on:click.outside="open = false"></div>
</div>
```

## Learn

Available **core** directives:

| Directive | Description |
| --- | --- |
| [`x-data`](#x-data) | Declares a new component scope or nested scope with associated data. |
| [`x-component`](#x-component) | Assigns a key to a component. |
| [`x-ref`](#x-ref) | Stores a reference to the DOM element in the component using the specified key. |
| [`x-locals`](#x-locals) | Creates storage local to the element and its offspring. |
| [`x-post`](#x-post) | Runs an expression after all directives on element --- and offspring directives --- have been executed. |
| [`x-uninit`](#x-uninit) | Runs an expression when an element is removed from the DOM. |
| [`x-static`](#x-static) | Runs an expression without keeping track of changes. |
| [`x-effect`](#x-effect) | Evaluates an expression and keeps track of changes. |
| [`x-bind`](#x-attr) | Sets the value of an attribute to the result of a JS expression. |
| [`x-style`](#x-style) | Similar to `x-attr`, but will update the `style` attribute. |
| [`x-class`](#x-class) | Set/Remove one or more classes based on the truth of the specified expression. |
| [`x-text`](#x-text) | Works similarly to `x-attr`, but will update the `innerText` of an element. |
| [`x-html`](#x-html) | Works similarly to `x-attr`, but will update the `innerHTML` of an element. |
| [`x-on`](#x-on) | Attaches an event listener to the element. Executes JS expression when emitted. |
| [`x-model`](#x-model) | Adds "two-way data binding" to an element. Keeps input element in sync with component data. |
| [`x-if`](#x-if) | Remove or inserts an element from/into the DOM depending on expression (true or false). |
| [`x-else`](#x-else) | Remove or inserts an element from/into the DOM depending on expression (true or false) and a preceding `if` or `else` directive. |
| [`x-each`](#x-each) | Create new DOM nodes for each item in an array, associative map, or integer range. |
| [`x-show`](#x-show) | Toggles `display: none;` on the element depending on expression (true or false). |
| [`x-cloak`](#x-cloak) | This attribute is removed when InlineJS initializes. Useful for hiding pre-initialized DOM. |