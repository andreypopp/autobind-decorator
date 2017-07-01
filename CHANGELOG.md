# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
