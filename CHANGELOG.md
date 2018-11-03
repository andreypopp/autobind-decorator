# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.2.1"></a>
## [2.2.1](https://github.com/andreypopp/autobind-decorator/compare/v2.2.0...v2.2.1) (2018-11-03)


### Bug Fixes

* **typescript:** definition for exported new methods ([#71](https://github.com/andreypopp/autobind-decorator/issues/71)) ([0cc3477](https://github.com/andreypopp/autobind-decorator/commit/0cc3477))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/andreypopp/autobind-decorator/compare/v2.1.0...v2.2.0) (2018-11-02)


### Features

* **module:** export boundMethod and boundClass as modules ([9edeabf](https://github.com/andreypopp/autobind-decorator/commit/9edeabf))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/andreypopp/autobind-decorator/compare/v2.0.0...v2.1.0) (2017-07-01)


### Bug Fixes

* **core:** allow user set new value ([98968ee](https://github.com/andreypopp/autobind-decorator/commit/98968ee))



# 2.0.0

Use babel 6 to compile source.

**If you use autobind-decorator 2.x in CommonJS environment, don’t forget to add `.default` to your import:**

```diff
- const autobind = require('autobind-decorator')
+ const autobind = require('autobind-decorator').default
```

If you used ES modules, you’re already all good:

```js
import autobind from 'autobind-decorator' // no changes here 😀
```
