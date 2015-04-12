/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 *
 * The decorator may be used on classes or methods
 * ```
 * @autobind
 * class FullBound {}
 *
 * class PartBound {
 *   @autobind
 *   method () {}
 * }
 * ```
 */
export default function autobind(...args) {
  if (args.length === 1) {
    return boundClass(...args);
  } else {
    return boundMethod(...args);
  }
}

/**
* Use boundMethod to bind all methods on the target.prototype
*/
function boundClass(target) {
  // (Using reflect to get all keys including symbols)
  Reflect.ownKeys(target.prototype).forEach(key => {
    // Ignore special case target method
    if (key === 'constructor') return;

    var descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

    // Only methods need binding
    if (typeof descriptor.value === 'function') {
      Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
    }
  });
  return target;
}

/**
* Return a descriptor removing the value and returning a getter
* The getter will return a .bind version of the function
* and memoize the result against a symbol on the instance
*/
function boundMethod(target, key, descriptor) {
  let _key;
  let fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new Error('@autobind decorator can only be applied to methods not: ' + typeof fn);
  }

  if (typeof key === 'string') {
    // Add the key to the symbol name for easier debugging
    _key = Symbol('@autobind method: ' + key);
  } else if (typeof key === 'symbol') {
    // A symbol cannot be coerced to a string
    _key = Symbol('@autobind method: (symbol)');
  } else {
    throw new Error('Unexpected key type: ' + typeof key);
  }

  return {
    configurable: true, // must be true or we could not be changing it
    get () {
      if (! this.hasOwnProperty(_key)) {
        this[_key] = fn.bind(this);
      }
      return this[_key];
    }
  };
}

