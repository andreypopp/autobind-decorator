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
