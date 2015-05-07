# autobind decorator

This is a class or method decorator which will bind methods it to an
object so `this` always points to an object instance within a method.

As decorators are a part of future ES7 standard they can only be used with
transpilers such as [Babel](http://babeljs.io).

Installation:

    % npm install autobind-decorator core-js

Example:

    import 'core-js/modules/es6.reflect' // Reflect polyfill is required
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
