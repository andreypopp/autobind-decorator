/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 */

export default function autobind(target, name, descriptor) {
  if (typeof descriptor.value !== 'function') {
    throw new Error('@autobind decorator can only be applied to methods');
  }
  let method = descriptor.value;
  descriptor = {
    ...descriptor,
    get() {
      let value = method.bind(this);
      Object.defineProperty(this, name, {value});
      return value;
    }
  };
  delete descriptor.writable;
  delete descriptor.value;
  return descriptor;
}
