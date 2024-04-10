# InlineJS

[![npm (scoped)](https://img.shields.io/npm/v/@benbraide/inlinejs.svg)](https://www.npmjs.com/package/@benbraide/inlinejs) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/minzip/@benbraide/inlinejs.svg)](https://www.npmjs.com/package/@benbraide/inlinejs)

Run JavaScript code by embedding them in your HTML using the element as context.

`InlineJS` is a component-based reactive framework inspired by [Alpine.js](https://github.com/alpinejs/alpine).

`InlineJS` works without creating shadow DOMs.

> **Notes:**
> - Directives are of the general form: `hx-[DirectiveName]` or `data-hx-[DirectiveName]`. Example: `hx-effect` or `data-hx-effect`.
> - The `hx-` prefix can be configured via the global `config` object.
> - `InlineJS` binds to elements with the `hx-data` directive present.

## Install

 - Grab source or distribution versions from `GitHub`
 - Include script in your HTML file.

## CDNs

```html
<script src="https://cdn.jsdelivr.net/npm/@benbraide/inlinejs@1.x.x/dist/inlinejs.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@benbraide/inlinejs@1.x.x/dist/inlinejs.min.js"></script>
```

## NPM Install

```
npm install @benbraide/inlinejs
```

## Initialization
```js
import { BootstrapAndAttach } from  '@benbraide/inlinejs';

BootstrapAndAttach();
```
>`BootstrapAndAttach` takes an optional DOM element to search. Defaults to the document element.

## Snippets

*Dropdown/Modal*
```html
<div hx-data="{ open: false }">
    <button hx-on:click="open = true">Open Dropdown</button>
    <div hx-show="open" hx-on:click.outside="open = false">
        Dropdown Body
    </div>
</div>
```

*Tabs*
```html
<div hx-data="{ tab: 'foo' }">
    <button hx-class:active="tab === 'foo'" hx-on:click="tab = 'foo'">Foo</button>
    <button hx-class:active="tab === 'bar'" hx-on:click="tab = 'bar'">Bar</button>

    <div hx-show="tab === 'foo'">Tab Foo</div>
    <div hx-show="tab === 'bar'">Tab Bar</div>
</div>
```

You can even use it for non-trivial things:
*Pre-fetching a dropdown's HTML content on hover*
```html
<div hx-data="{ open: false, html: 'Loading Spinner...' }">
    <button
        hx-on:mouseenter.once="html = $fetch('/dropdown-partial.html')"
        hx-on:click="open = true"
    >Show Dropdown</button>

    <div hx-show="open" hx-html="html" hx-on:click.outside="open = false"></div>
</div>
```

**Text Interpolation**

`InlineJS` supports reactive text interpolation using a pair of `{{` and `}}`. Interpolation is valid for `attribute values` and `text contents`.

**Example**

```html
<form hx-data="{ btnText: 'Save', txtValue: 'Default value' }">
    <input name="content" value="{{ txtValue }}">
    <button type="submit">{{ btnText }} Draft</button>
</form>
```

**Quick Notes**
> - When using the compiled scripts in a `script` tag no initialization is necessary, as `InlineJS` will automatically initialize and bind to the document.
> - If the result of an evaluated expression is a function, most directives will call that function.
> - When evaluating an expression, `this` refers to the element that the directive is being executed on.
> - Directives are executed accordingly, from `left` to `right`, as they appear on an element. There is no precedence.
> - This is the base `API` and it can be used for development and extension purposes.

## Extending InlineJS

**Creating Directives**

```js
import { CreateDirectiveHandlerCallback } from  '@benbraide/inlinejs';
import { AddDirectiveHandler } from  '@benbraide/inlinejs';

const greeterDirective = CreateDirectiveHandlerCallback('greeter', (directiveDetails) => { ... });

AddDirectiveHandler(greeterDirective);
```
> **Note:** The above directive will be referenced as `hx-greeter`.

- Call the `CreateDirectiveHandlerCallback` to create the handler for your directive. The function requires a name for the directive and a callback as the handler.
- Pass the returned directive details to `AddDirectiveHandler` to register your new directive.

> The specified callback function is provided an object containing the following:
> - `contextElement` references the element that the directive was used on.
> - `componentId` holds the `id` of the context/current component.
> - `component` may hold the context/current component.
> - `expression` value specified as the `attribute` value on the element.
> E.g. `hx-greeter="doSomething()"`. `doSomething()` is the expression.
> - `argKey` if the directive followed by a `:`, then more text, this refers to the text after the `:`. E.g. `hx-greeter:unique`.
> - `argOptions` holds a list of texts supplied by the user delimited by a `.`. E.g. `hx-greeter.new.transform`
> **Note:** the user is free to specify both `argKey` and `argOptions` in a single usage.

If you would prefer using a class, then you could use:
```ts
import { IDirectiveHandler } from  '@benbraide/inlinejs';
import { AddDirectiveHandler } from  '@benbraide/inlinejs';

class GreeterDirective implements IDirectiveHandler{
    public GetName(){ return 'greeter'; }
    public Handle(directiveDetails){ ... }
}

const greeterDirective = new GreeterDirective;

AddDirectiveHandler(greeterDirective);
```

If you rather not use Node.js and a build step, then you could use:
```js
function greeterDirectiveHandler(directiveDetails){ ... }
```
> - The function must be defined in the `global` scope in order to be found.
> - The function name must be suffixed by `DirectiveHandler`.
> - The function name must be `camelCased`.

**Creating Magic Properties**

```js
import { CreateMagicHandlerCallback } from  '@benbraide/inlinejs';
import { AddMagicHandler } from  '@benbraide/inlinejs';

const greeter = CreateMagicHandlerCallback('greeter', (context) => { ... });

AddMagicHandler(greeterDirective);
```
> **Note:** The above magic property will be referenced as `$greeter`.

- Call the `CreateMagicHandlerCallback` to create the handler for your magic property. The function requires a name for the directive and a callback as the handler.
- Pass the returned directive details to `AddMagicHandler` to register your new magic property.

> **Note:** `CreateMagicHandlerCallback` takes an optional callback function as third parameter. It is called when the magic property is being accessed.

> The specified callback function is provided an object containing the following:
> - `contextElement` references the element that the directive was used on.
> - `componentId` holds the `id` of the context/current component.
> - `component` may hold the context/current component.

If you would prefer using a class, then you could use:
```ts
import { IMagicHandler } from  '@benbraide/inlinejs';
import { AddMagicHandler } from  '@benbraide/inlinejs';

class Greeter implements IMagicHandler{
    public GetName(){ return 'greeter'; }
    public Handle(context){ ... }
    public OnAccess(context){ ... }
}

const greeter = new Greeter;

AddMagicHandler(greeter);
```

## Packages and Plugins
- [Core](https://github.com/benbraide/inlinejs-core)
- [Extended](https://github.com/benbraide/inlinejs-extended)
- [Animation](https://github.com/benbraide/inlinejs-animation)
- [Screen](https://github.com/benbraide/inlinejs-screen)
- [Alert](https://github.com/benbraide/inlinejs-alert)
- [Swal Alert](https://github.com/benbraide/inlinejs-swal)
- [Collections](https://github.com/benbraide/inlinejs-collections)
- [Router](https://github.com/benbraide/inlinejs-router)
- [Moment](https://github.com/benbraide/inlinejs-moment)
- [Database](https://github.com/benbraide/inlinejs-database)
- [Element](https://github.com/benbraide/inlinejs-element)
- [Components](https://github.com/benbraide/inlinejs-components)
- [Canvas](https://github.com/benbraide/inlinejs-canvas)
- [Sketch](https://github.com/benbraide/inlinejs-sketch)
- [Theme](https://github.com/benbraide/inlinejs-theme)
- [Geolocation](https://github.com/benbraide/inlinejs-geolocation)
- [Quill](https://github.com/benbraide/inlinejs-quill)
- [Stripe](https://github.com/benbraide/inlinejs-stripe)
- [Echo](https://github.com/benbraide/inlinejs-echo)
- [Socket](https://github.com/benbraide/inlinejs-socket)
- [Socket Server](https://github.com/benbraide/inlinejs-socket-server)

## Bundles
- [Pack](https://github.com/benbraide/inlinejs-pack)
- [Plugins](https://github.com/benbraide/inlinejs-plugins)

## Resources
- [Demos](https://github.com/benbraide/inlinejs-demos)
- [Hangman Game](https://github.com/benbraide/inlinejs-hangman)

## Utilities
- [Intellisense](https://github.com/benbraide/inlinejs-intellisense)
- [Chrome Dev Tools](https://github.com/benbraide/inlinejs-devtools)

## Security
If you find a security vulnerability, please send an email to [benplaeska@gmail.com]()

`InlineJS` relies on a custom implementation using the `Function` object to evaluate its directives. Despite being more secure then `eval()`, its use is prohibited in some environments, such as Google Chrome App, using restrictive Content Security Policy (CSP).

If you use `InlineJS` in a website dealing with sensitive data and requiring [CSP](https://csp.withgoogle.com/docs/strict-csp.html), you need to include `unsafe-eval` in your policy. A robust policy correctly configured will help protecting your users when using personal or financial data.

Since a policy applies to all scripts in your page, it's important that other external libraries included in the website are carefully reviewed to ensure that they are trustworthy and they won't introduce any Cross Site Scripting vulnerability either using the `eval()` function or manipulating the DOM to inject malicious code in your page.

## License

Licensed under the MIT license, see [LICENSE.md](LICENSE.md) for details.