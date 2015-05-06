# autobind decorator

This is a class or method decorator which will bind methods it to an
object so `this` always points to an object instance within a method.

As decorators are a part of future ES7 standard they can only be used with
transpilers such as [Babel](http://babeljs.io).

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

    const component = new Component(42)
    const method = component.method // .bind(component) isn't needed!
    method() // returns 42


    // Also usable on the class to bind all methods

    @autobind
    class Component { }
