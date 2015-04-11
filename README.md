# autobind decorator

This is a method decorator which is when applied to a method binds it to an
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

    let component = new Component(42)
    let method = component.method // .bind(component) isn't needed!
    method() // returns 42
