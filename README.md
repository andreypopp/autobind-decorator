# autobind decorator

A class or method decorator which binds methods to the instance
so `this` is always correct, even when the method is detached.

This is particularly useful for situations like React components, where 
you often pass methods as event handlers and would otherwise need to 
`.bind(this)`.
```
Before:
<button onClick={ this.handleClick.bind(this) }></button>

After:
<button onClick={ this.handleClick }></button>
```

As decorators are a part of future ES7 standard they can only be used with
transpilers such as [Babel](http://babeljs.io). Please note that using Babel 
6.0 the implementation of the decorator spec is currently on hold as the syntax 
is not final. If you would like to use this project with Babel 6.0, you may use 
[babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) to have it compiled similar to Babel 5.

Installation:

    % npm install autobind-decorator

Example:

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

    @autobind
    class Component { }
