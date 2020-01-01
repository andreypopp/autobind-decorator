const OBJECT_INSTANCE = {};

/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 * and memoize the result against a symbol on the instance
 */
export function boundMethod(target, key, descriptor) {
	let fn = descriptor.value;

	if (typeof fn !== 'function') {
		throw new TypeError(`@boundMethod decorator can only be applied to methods not: ${typeof fn}`);
	}

	// In IE11 calling Object.defineProperty has a side-effect of evaluating the
	// getter for the property which is being replaced. This causes infinite
	// recursion and an "Out of stack space" error.
	let definingProperty = false;

	function reDefineProperty(instance, propertyValue, callGetter) {
		let boundFn = null;
		definingProperty = true;
		let underlyingFn = propertyValue;
		// Dummy object which is always strictly not equal to any other value
		let currentlyBoundFn = OBJECT_INSTANCE;
		const getter = function () {
			if (currentlyBoundFn !== underlyingFn) {
				if (typeof underlyingFn === 'function') {
					boundFn = underlyingFn.bind(this);
				} else {
					boundFn = underlyingFn;
				}
				currentlyBoundFn = underlyingFn;
			}
			return boundFn;
		}; 
		Object.defineProperty(instance, key, {
			configurable: true,
			get: getter,
			set(value) {
				underlyingFn = value;
			}
		});
		definingProperty = false;
		if (callGetter) {
			return getter.call(instance);
		}
	}

	return {
		configurable: true,
		get() {
			// If getter is called
			//  * definingProperty: in IE while defining property
			//  * this === target: on prototype itself Clazz.prototype[key]
			//  * Object.getPrototypeOf(this) !== target: getter is called on super
			if (definingProperty || this === target || typeof fn !== 'function' || Object.getPrototypeOf(this) !== target) {
				return fn;
			}

			return reDefineProperty(this, fn, true);
		},
		set(value) {
			// accessing prototype
			if (this === target) {
				fn = value;
			} else {
				// If setter is called on instance we should create instance bound
				// property here. We won't get into getter anymore
				// setter on super behaves like on instance
				reDefineProperty(this, value, false);
			}
		}
	};
}

/**
 * Use boundMethod to bind all methods on the target.prototype
 */
export function boundClass(target) {
	// (Using reflect to get all keys including symbols)
	let keys;
	// Use Reflect if exists
	if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
		keys = Reflect.ownKeys(target.prototype);
	} else {
		keys = Object.getOwnPropertyNames(target.prototype);
		// Use symbols if support is provided
		if (typeof Object.getOwnPropertySymbols === 'function') {
			keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
		}
	}

	keys.forEach(key => {
		// Ignore special case target method
		if (key === 'constructor') {
			return;
		}

		const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

		// Only methods need binding
		if (typeof descriptor.value === 'function') {
			Object.defineProperty(target.prototype, key, boundMethod(target.prototype, key, descriptor));
		}
	});
	return target;
}

export default function autobind(...args) {
	if (args.length === 1) {
		return boundClass(...args);
	}
	return boundMethod(...args);
}
