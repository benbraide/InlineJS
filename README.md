# InlineJS

[![npm (scoped)](https://img.shields.io/npm/v/@benbraide/inlinejs.svg)](https://www.npmjs.com/package/@benbraide/inlinejs) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@benbraide/inlinejs.svg)](https://www.npmjs.com/package/@benbraide/inlinejs)

Run JavaScript code by embedding them in your HTML using the element as context.

InlineJS is component-based spin-off to [Alpine.js](https://github.com/alpinejs/alpine).

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

**Text Interpolation**

In InlineJS reactive text can be interpolated using a pair of `{{` and `}}`. Interpolation is valid for `attribute values` and `text contents`.

**Example**

```html
<form x-data="{ btnText: 'Save', txtValue: 'Default value' }">
	<input name="content" value="{{ txtValue }}">
	<button type="submit">{{ btnText }} Draft</button>
</form>
```

**Quick Notes**
> - When using the compiled scripts in a `script` tag no initialization is necessary, as InlineJS will automatically initialize and bind to the document.
> - If the result of an evaluated expression is a function, most directives will call that function.
> - When evaluating an expression, `this` refers to the element that the directive is being executed on.
> - Directives are executed accordingly from `left` to `right` as they appear on an element. There is no precedence.

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
| [`x-style`](#x-style) | Similar to `x-bind`, but will update the `style` attribute. |
| [`x-class`](#x-class) | Set/Remove one or more classes based on the truth of the specified expression. |
| [`x-text`](#x-text) | Works similarly to `x-bind`, but will update the `innerText` of an element. |
| [`x-html`](#x-html) | Works similarly to `x-bind`, but will update the `innerHTML` of an element. |
| [`x-on`](#x-on) | Attaches an event listener to the element. Executes JS expression when emitted. |
| [`x-model`](#x-model) | Adds "two-way data binding" to an element. Keeps input element in sync with component data. |
| [`x-if`](#x-if) | Remove or inserts an element from/into the DOM depending on expression (true or false). |
| [`x-else`](#x-else) | Remove or inserts an element from/into the DOM depending on expression (true or false) and a preceding `x-if` or `x-else` directive. |
| [`x-each`](#x-each) | Create new DOM nodes for each item in an array, associative map, or integer range. |
| [`x-show`](#x-show) | Toggles `display: none;` on the element depending on expression (true or false). |
| [`x-cloak`](#x-cloak) | This attribute is removed when InlineJS initializes. Useful for hiding pre-initialized DOM. |

Available **core** magic properties:

| Property | Description |
| --- | --- |
| [`$component`](#component) |  Retrieve the specified component storage. |
| [`$locals`](#locals) |  Retrieve the local storage associated with the element. |
| [`$proxy`](#proxy) |  Retrieve the root proxy. |
| [`$native`](#native) |  Retrieve the non-proxied data associated with a key. |
| [`$refs`](#refs) |  Retrieve DOM elements marked with `x-ref` inside the component. |
| [`$scope`](#scope) |  Retrieve the current scope. |
| [`$scopes`](#scopes) |  Retrieve all scopes in the current component. |
| [`$stream`](#stream) | Stream the specified data using a callback.  |
| [`$wait`](#wait) | Wait the specified data using a callback.  |
| [`$static`](#static) |  Suppress reactivity for the specified access. |
| [`$unoptimized`](#unoptimized) |  Suppress optimizations for the specified access. |
| [`$watch`](#watch) |  Watch a given expression for changes. |
| [`$pick`](#pick) |  Return one of two values based on a predicate. |
| [`$rel`](#rel) |  Use one of the `relational` operators. |
| [`$log`](#log) |  Use one of the `logical` operators. |
| [`$math`](#math) |  Use one of the `arithmetic` operators. |
| [`$dom`](#dom) |  Access a DOM property. |
| [`$class`](#class) |  Use one of the available `class` helpers. |
| [`$eval`](#eval) |  Evaluate an expression and return the result. |
| [`$nextTick`](#nexttick) | Execute a given expression **after** `InlineJS` has made its reactive DOM updates. |

### Directives

---

### `x-data`

**Example:** `<div x-data="{ foo: 'bar' }">...</div>`

**Structure:** `<div x-data="[object literal]|[Function]">...</div>`

`x-data` declares a new component scope. It tells the framework to initialize a new component with the following data object.

**Extract Component Logic**

You can extract data (and behavior) into reusable functions:

```html
<div x-data="dropdown">
    <button x-on:click="open">Open</button>

    <div x-show="isOpen()" x-on:click.outside="close">
        Dropdown
    </div>
</div>

<script>
    function dropdown() {
        return {
            show: false,
            open() { this.show = true },
            close() { this.show = false },
            isOpen() { return this.show },
        }
    }
</script>
```

You can also mix-in multiple data objects using object destructuring:

```html
<div x-data="{...dropdown(), ...tabs()}">
```
**Component config**

You can specify a `$config` property on the object used to initialize a component. This enables you to specify per-component configurations.

```html
<div x-data="{ $config: { name: 'my-component', reactiveState: 'optimized' } }"></div>
```
> Available configurations are:
> - `reativeState` specifies the reactivity state of a component. One of `default`, `optimized`, or `unoptimized`.
> - `name` specifies the name of the component.
> - `locals` specifies data that should be treated as local to the root element and its offspring.
> - `init` specifies a function to execute after the component has been initialized.
> - `uninit` specifies a function to execute when the root element is removed from the DOM.
> - `post` specifies a function to execute after all directives have been processed, including offspring's directives.

**Nested scope**

You can create nested scopes by using the `x-data` directive on an offspring of a component:

```html
<div x-data="{ level: 'top' }">
    <div x-data="{ level: 'nested' }">
	    <p x-text="$scope.level"></p>
	    <p x-text="$parent.level"></p>
    </div>
</div>
```

> `x-data` exposes the following local properties, available to the component root and its offspring:
> - `$name` retrieves the name of the current scope. If not accessed from a nested scope, then it returns the name of the current component.
> - `$componentName` retrieves the name of the current component.
> - `$parent` retrieves the data associated with the parent of the current scope. Returns `undefined` if not accessed from a nested scope.

---

### `x-component`
**Example:** `<div x-data x-component="my-component"></div>`

**Structure:** `<div x-data="..." x-component="[identifier]"></div>`

`x-component` assigns a name to a component.

**`evaluate` argument**

**Example:** `<div x-data x-component:evaluate="componentName"></div>`

Use the `evaluate` argument to instruct the directive to evaluate the specified expression.

---

### `x-ref`
**Example:** `<div x-data x-ref="myDiv"></div>`

**Structure:** `<div x-data="..." x-ref="[variable]"></div>`

`x-ref` stores a reference to the DOM element in the component using the specified key. The key is added to the `$refs` global magic property.

---

### `x-locals`

**Example:** `<div x-data x-locals="{ foo: 'bar' }">...</div>`

**Structure:** `<div x-locals="[object literal]|[Function]">...</div>`

`x-data` declares a new component scope. It tells the framework to initialize a new component with the following data object.

---

### `x-post`
**Example:** `<div x-data x-post="console.log('Every offspring initialized')"></div>`

**Structure:** `<div x-data="..." x-post="[expression]"></div>`

`x-post` runs an expression after all directives on element, and offspring directives, have been executed.

---

### `x-uninit`
**Example:** `<div x-data="{ foo: 'bar' }" x-uninit="console.log('Element removed')"></div>`

**Structure:** `<div x-data="..." x-uninit="[expression]"></div>`

`x-uninit` runs an expression when an element is removed from the DOM.

---

### `x-static`
**Example:** `<div x-data="{ foo: 'bar' }" x-static="foo = 'baz'"></div>`

**Structure:** `<div x-data="..." x-static="[expression]"></div>`

`x-static` runs an expression without keeping track of changes.

---

### `x-effect`
**Example:** `<div x-data="{ value: 9 }" x-effect="doubled = value * 2"></div>`

**Structure:** `<div x-data="..." x-effect="[expression]"></div>`

`x-effect` runs an expression and keeps track of changes. When changes occur elsewhere, the expression is re-run.

---

### `x-bind`

> Note: You are free to use the shorter ":" syntax: `:type="..."`

**Example:** `<input x-bind="inputType">`

**Structure:** `<input x-bind:[attribute]="[expression]">`

`x-bind` sets the value of an attribute to the result of a JavaScript expression. The expression has access to all the keys of the component's data object, and will update every-time its data is updated.

> Note: attribute bindings ONLY update when their dependencies update. The framework is smart enough to observe data changes and detect which bindings care about them.

**`x-bind` for boolean attributes**

`x-bind` supports boolean attributes in the same way as value attributes, using a variable as the condition or any JavaScript expression that resolves to `true` or `false`.

For example:
```html
<!-- Given: -->
<button x-bind:disabled="myVar">Click me</button>

<!-- When myVar == true: -->
<button disabled="disabled">Click me</button>

<!-- When myVar == false: -->
<button>Click me</button>
```

This will add or remove the `disabled` attribute when `myVar` is true or false respectively.

Boolean attributes are supported as per the [HTML specification](https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute), for example `disabled`, `readonly`, `required`, `checked`, `hidden`, `selected`, `open`, etc.

> Note: If you need a false state to show for your attribute, such as `aria-*`, chain `.toString()` to the value while binding to the attribute. For example: `:aria-expanded="isOpen.toString()"` would persist whether  `isOpen` was `true` or `false`.

---

### `x-style`
**Example:**
```
<span x-style:display="'block'"></span>
<span x-style="{ display: 'block', width: '1rem' }"></span>
```

**Structure:**
```
<span x-style:[property]="[expression]"></span>
<span x-style="{ [property]: [expression], ... }"></span>
```

`x-style` sets the value of a style property on an element to the evaluated expression.

---

### `x-class`

> Note: You are free to use the shorter "." syntax: `.block="..."`

**Example:**
```
<span x-class:block="shouldBeBlock"></span>
<span x-class="{ block: true, inline: false }"></span>
```

**Structure:**
```
<span x-class:[name]="[boolean expression]"></span>
<span x-class="{ [name]: [boolean expression], ... }"></span>
```

`x-class` sets or removes a class name on an element based on the truthiness of the evaluated expression.

---

### `x-text`
**Example:** `<span x-text="foo"></span>`

**Structure:** `<span x-text="[expression]"`

`x-text` works similarly to `x-bind`, except instead of updating the value of an attribute, it will update the `innerText` of an element.

> A promise, or promise-like object, may be returned and `x-text` will wait for it to be resolved and the resulting value used.

---

### `x-html`
**Example:** `<span x-html="foo"></span>`

**Structure:** `<span x-html="[expression]"`

`x-html` works similarly to `x-bind`, except instead of updating the value of an attribute, it will update the `innerHTML` of an element.

> A promise, or promise-like object, may be returned and `x-html` will wait for it to be resolved and the resulting value used.

> :warning: **Only use on trusted content and never on user-provided content.** :warning:
>
> Dynamically rendering HTML from third parties can easily lead to [XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) vulnerabilities.

---

### `x-on`

> Note: You are free to use the shorter "@" syntax: `@click="..."`

**Example:** `<button x-on:click="foo = 'bar'"></button>`

**Structure:** `<button x-on:[event]="[expression]"></button>`

`x-on` attaches an event listener to the element it's declared on. When that event is emitted, the JavaScript expression set as its value is executed.

If any data is modified in the expression, other element attributes "bound" to this data, will be updated.

> Note: You can also specify a JavaScript function name

> - This directive exposes a `$event` context variable, representing the generated native event, accessible during the evaluation of the specified expression.
> - When a function is specified, it is passed the generated event as the first argument.

**Example:** `<button x-on:click="myFunction"></button>`

This is equivalent to: `<button x-on:click="myFunction($event)"></button>`

**`keydown` modifiers**

**Example:** `<input type="text" x-on:keydown.esc="open = false">`

You can specify specific keys to listen for using `keydown` modifiers appended to the `x-on:keydown` directive. Note that the modifiers are kebab-cased versions of `Event.key` values.

Examples: `enter`, `escape`, `arrow-up`, `arrow-down`

> Note: You can also listen for system-modifier key combinations like: `x-on:keydown.ctrl.enter="foo"`
> Multiple keys can be combined for alternatives e.g. `x-on:keydown.enter.space`
> Character ranges can be specified e.g. `x-on:keydown.a-z` `x-on:keydown.0-9`
> Character groups can be specified e.g. `x-on:keydown.alpha` `x-on:keydown.digits`

**`.outside` modifier**

**Example:** `<div x-on:click.outside="showModal = false"></div>`

When the `.outside` modifier is present, the event handler will only be executed when the event originates from a source other than itself, or its offspring.

This is useful for hiding dropdowns and modals when a user clicks away from them.

**`.prevent` modifier**
**Example:** `<input type="checkbox" x-on:click.prevent>`

Adding `.prevent` to an event listener will call `preventDefault` on the triggered event. In the above example, this means the checkbox wouldn't actually get checked when a user clicks on it.

**`.stop` modifier**
**Example:** `<div x-on:click="foo = 'bar'"><button x-on:click.stop></button></div>`

Adding `.stop` to an event listener will call `stopPropagation` on the triggered event. In the above example, this means the "click" event won't bubble from the button to the outer `<div>`. Or in other words, when a user clicks the button, `foo` won't be set to `'bar'`.

**`.self` modifier**
**Example:** `<div x-on:click.self="foo = 'bar'"><button></button></div>`

Adding `.self` to an event listener will only trigger the handler if the `$event.target` is the element itself. In the above example, this means the "click" event that bubbles from the button to the outer `<div>` will **not** run the handler.

**`.window` modifier**
**Example:** `<div x-on:resize.window="isOpen = window.outerWidth > 768 ? false : open"></div>`

Adding `.window` to an event listener will install the listener on the global window object instead of the DOM node on which it is declared. This is useful for when you want to modify component state when something changes with the window, like the resize event. In this example, when the window grows larger than 768 pixels wide, we will close the modal/dropdown, otherwise maintain the same state.

>Note: You can also use the `.document` modifier to attach listeners to `document` instead of `window`

**`.once` modifier**
**Example:** `<button x-on:mouseenter.once="fetchSomething()"></button>`

Adding the `.once` modifier to an event listener will ensure that the listener will only be handled once. This is useful for things you only want to do once, like fetching HTML partials and such.

**`.passive` modifier**
**Example:** `<button x-on:mousedown.passive="interactive = true"></button>`

Adding the `.passive` modifier to an event listener will make the listener a passive one, which means `preventDefault()` will not work on any events being processed, this can help, for example with scroll performance on touch devices.

**`.debounce` modifier**
**Example:** `<input x-on:input.debounce="fetchSomething()">`

The `.debounce` modifier allows you to "debounce" an event handler. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specify a custom wait time like so:

```
<input x-on:input.debounce.750="fetchSomething()">
<input x-on:input.debounce.750ms="fetchSomething()">
```

---

### `x-model`
**Example:** `<input type="text" x-model="foo">`

**Structure:** `<input type="text" x-model="[data item]">`

`x-model` adds "two-way data binding" to an element. In other words, the value of the input element will be kept in sync with the value of the data item of the component.

> Note: `x-model` is smart enough to detect changes on text inputs, checkboxes, radio buttons, textareas, selects, and multiple selects.

**`.number` modifier**
**Example:** `<input x-model.number="age">`

The `number` modifier will convert the input's value to a number. If the value cannot be parsed as a valid number, the original value is returned.

**`.debounce` modifier**
**Example:** `<input x-model.debounce="search">`

The `debounce` modifier allows you to add a "debounce" to a value update. In other words, the event handler will NOT run until a certain amount of time has elapsed since the last event that fired. When the handler is ready to be called, the last handler call will execute.

The default debounce "wait" time is 250 milliseconds.

If you wish to customize this, you can specify a custom wait time like so:

```
<input x-model.debounce.750="search">
<input x-model.debounce.750ms="search">
```

---

### `x-if`
**Example:** `<template x-if="true"><div>...</div></template>`

**Structure:** `<template x-if="[expression]">...</template>`

For cases where `x-show` isn't sufficient (`x-show` sets an element to `display: none` if it's false), `x-if` can be used to  actually remove an element completely from the DOM.

>**Note**:
> - A `template` element is required for this directive.
> - The template element must have a single direct child.

---

### `x-else`
**Example:**
```html
<template x-if="count == 0"><div>...</div></template>
<template x-else="count == 1"><div>...</div></template>
<template x-else><div>...</div></template>
```

**Structure:** `<template x-else="[optional expression]">...</template>`

The `x-else` directive enables an `if-then-else` paradigm. A `x-if` or `x-else` directive is required to precede it.

>**Note**:
> - A `template` element is required for this directive.
> - The template element must have a single direct child.

---

### `x-each`
**Example:**
```html
<template x-each="items"><div>...<div></template>
<template x-each="items as item"><div>...<div></template>
<template x-each="items as key => item"><div>...<div></template>
```
**Structure:**
```html
<template x-each="[expression]">...</template>
<template x-each="[expression] as [identifier]">...</template>
<template x-each="[expression] as [key] => [identifier]">...</template>
```

`x-each` is available for cases when you want to create new DOM nodes for each item in an array.

>**Note**:
> - A `template` element is required for this directive.
> - The template element must have a single direct child.

It exposes a `$each` local property with the following fields:

 - `count:` Retrieves the total count of the loop
 - `index:` Retrieves the current index
 - `value:` Retrieves the current value
 - `collection:` Retrieves the collection that is being iterated
 - `parent:` Retrieves the parent loop property, if any

It can iterate over arrays, key-value associative objects, and integer ranges.

A name can be specified for `$each.value` using the following syntax:

```html
<template x-each="items as item">
	<p>{{ item }}</p>
</template>
```
A name can be specified for `$each.index` using the following syntax:

```html
<template x-each="items as index => item">
	<p>{{ index }}{{ item }}</p>
</template>
```

#### Nesting `x-each`s
You can nest `x-each` loops. For example:

```html
<template x-each="items as item">
    <template x-each="item.subItems as subItem">
	    <div x-text="subItem"></div>
    </template>
</template>
```

#### Iterating over an integer range

Iteration over integers are supported. Example:

```html
<template x-each="10 as i"><div>...</div></template>
```

> By default, the iteration range is from `0` to `value - 1`.

Negative values can be specified. Example:

```html
<template x-each="-10 as i"><div>...</div></template>
```

> By default, the iteration range is from to `value + 1` to `0`.

---

### `x-show`
**Example:** `<div x-show="open"></div>`

**Structure:** `<div x-show="[expression]"></div>`

`x-show` toggles the `display: none;` style on the element depending if the expression resolves to `true` or `false`.

---

### `x-cloak`
**Example:** `<div x-data="{}" x-cloak></div>`

`x-cloak` attributes are removed from elements when InlineJS initializes. This is useful for hiding pre-initialized DOM. It's typical to add the following global style for this to work:

```html
<style>
    [x-cloak] { display: none; }
</style>
```
