import assert from 'assert';
import autobind from '../';

describe('autobind decorator', function() {

  class A {

    constructor() {
      this.value = 42;
    }

    @autobind
    getValue() {
      return this.value;
    }
  }

  it('binds methods to an instance', function() {
    let a = new A();
    let getValue = a.getValue;
    assert(getValue() === 42);
  });

  it('binds method only once', function() {
    let a = new A();
    assert(a.getValue === a.getValue);
  });

  it('throws if applied on a method of more than zero arguments', function() {
    assert.throws(() => {
      class A {
        @autobind
        get value() {
          return 1;
        }
      }
    }, /@autobind decorator can only be applied to methods/);
  });

});
