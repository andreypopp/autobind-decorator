# autobind decorator

A class or method decorator which binds methods to the instance so `this` is always correct, even when the method is detached.

This is particularly useful for situations like React components, where you often pass methods as event handlers and would otherwise need to `.bind(this)`.

```js
// Before:
<button onClick={ this.handleClick.bind(this) }></button>

// After:
<button onClick={ this.handleClick }></button>
```

As [decorators](https://github.com/wycats/javascript-decorators) are a part of [future ECMAScript standard](https://github.com/tc39/proposals) they can only be used with transpilers such as [Babel](http://babeljs.io).

## Installation:

```
npm install autobind-decorator
```

### Supported platforms:

#### Output

We target IE11+ browsers (see [out browserslist](./src/browserslist)) with the following caveats:

`main` entry is in ES5

`module` entry is in ES6+ (notably ES modules to enable tree shaking)

#### Dev

node 8.10+ with latest npm

### Note uglify users:

Starting from v2.2, we added `module` entry in package.json and kept `main` entry as is. `module` entry is for those who wish to use modern JavaScript (notably ES modules to enable tree shaking). If your environment doesn't understand the modern syntax, you can configure your tool to read the ES5 script via the `main` entry. EG: with webpack, you could do

```js
resolve: {
  mainFields: ['main']
}
```

You could also transpile the script to your target environment ([@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) is recommended). For more details, please read https://babeljs.io/blog/2018/06/26/on-consuming-and-publishing-es2015+-packages.

### Note Babel 6 users:

The implementation of the decorator transform is currently on hold as the syntax is not final. If you would like to use this project with Babel 6, you may use [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) which implement Babel 5 decorator transform for Babel 6.

### Note Babel 7 users:

Babel 7's `@babel/plugin-proposal-decorators` officially supports the same logic that babel-plugin-transform-decorators-legacy has, but integrates better with Babel 7's other plugins. You can enable this with

```json
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
  ]
}
```

in your Babel configuration. Note that `legacy: true` is specifically needed if you
want to get the same behavior as `transform-decorators-legacy` because there
are newer versions of the decorator specification coming out, and they do not
behave the same way. We are trying to keep this module up-to-date with the latest spec.

### Note TypeScript users:

This package will work out of the box with TypeScript (no Babel needed) and includes the `.d.ts` typings along with it.

## Examples:

### Recommended way to bind a method:

```js
import {boundMethod} from 'autobind-decorator'

class Component {
  constructor(value) {
    this.value = value
  }

  @boundMethod
  method() {
    return this.value
  }
}

let component = new Component(42)
let method = component.method // .bind(component) isn't needed!
method() // returns 42
```

`@boundMethod` makes `method` into an auto-bound method, replacing the explicit bind call later.

### Legacy approaches:

Magical `@autobind` that can be used on both classes and methods

```js
import autobind from 'autobind-decorator'

class Component {
  constructor(value) {
    this.value = value
  }

  @autobind
  method() {
    return this.value
  }
}

let component = new Component(42)
let method = component.method // .bind(component) isn't needed!
method() // returns 42

// Also usable on the class to bind all methods
// Please see performance if you decide to autobind your class
@autobind
class Component { }
```

Please see performance if you decide to autobind your class:

```js
import {boundClass} from 'autobind-decorator'

@boundClass
class Component {
  constructor(value) {
    this.value = value
  }

  method() {
    return this.value
  }
}

let component = new Component(42)
let method = component.method // .bind(component) isn't needed!
method() // returns 42
```

## Performance

`autobind` (`boundMethod`) on a method is lazy and is only bound once. :thumbsup:

However,

> It is unnecessary to do that to every function. This is just as bad as autobinding (on a class). You only need to bind functions that you pass around. e.g. `onClick={this.doSomething}`. Or `fetch.then(this.handleDone)`
  -- Dan Abramov‏

You should avoid using `autobind` (`boundClass`) on a class. :thumbsdown:

> I was the guy who came up with
autobinding in older Reacts and I'm glad
to see it gone. It might save you a few
keystrokes but it allocates functions
that'll never be called in 90% of cases
and has noticeable performance
degradation. Getting rid of autobinding
is a good thing
  -- Peter Hunt

## Alternative

You might want to look at [Class instance properties](https://tc39.github.io/proposal-class-public-fields/).
