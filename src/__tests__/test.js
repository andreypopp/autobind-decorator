import assert from 'assert';
import autobind, {boundMethod, boundClass} from '..';

describe('autobind method decorator: @boundMethod', () => {
	class A {
		constructor() {
			this.value = 42;
		}

		@boundMethod
		getValue() {
			return this.value;
		}
	}

	test('binds methods to an instance', () => {
		const a = new A();
		const {getValue} = a;
		assert(getValue() === 42);
	});

	test('binds method only once', () => {
		const a = new A();
		assert(a.getValue === a.getValue);
	});

	/** Parse errors. Submitted issue to babel #1238
	test('binds methods with symbols as keys', function () {
		var symbol = Symbol('method');
		class A {
			constructor () {
				this.val = 42;
			}
			@boundMethod
			[symbol] () {
				return this.val;
			}
		}
		let a = new A();
		let getValue = a[symbol];
		assert(getValue() === 42);
	});
	*/

	test('throws if applied on a method of more than zero arguments', () => {
		assert.throws(() => {
			class A { // eslint-disable-line no-unused-vars
				@boundMethod
				get value() {
					return 1;
				}
			}
		}, /decorator can only be applied to methods/);
	});

	test('should not override bound instance method, while calling super method with the same name', () => { // eslint-disable-line max-len
		class B extends A {
			@boundMethod
			getValue() {
				return super.getValue() + 8;
			}
		}

		const b = new B();
		let value = b.getValue();
		value = b.getValue();

		assert(value === 50);
	});

	describe('set new value', () => {
		class A {
			constructor() {
				this.data = 'A';
				this.foo = 'foo';
				this.bar = 'bar';
			}

			@boundMethod
			noop() {
				return this.data;
			}
		}

		const a = new A();

		test('should not throw when reassigning to an object', () => {
			a.noop = {
				foo: 'bar'
			};
			assert.deepStrictEqual(a.noop, {
				foo: 'bar'
			});
			assert.strictEqual(a.noop, a.noop);
		});

		test('should not throw when reassigning to a function', () => {
			a.noop = function noop() {
				return this.foo;
			};
			assert.strictEqual(a.noop(), 'foo');
			const {noop} = a;
			assert.strictEqual(noop(), 'foo');
			assert.strictEqual(a.noop, a.noop);
		});

		test('should not throw when reassigning to a function again', () => {
			a.noop = function noop2() {
				return this.bar;
			};
			assert(a.noop(), 'bar');
			const noop2 = a.noop;
			assert.strictEqual(noop2(), 'bar');
			assert.strictEqual(a.noop, a.noop);
		});

		test('should not throw when reassigning to an object after bound a function', () => {
			a.noop = {};
			assert.deepStrictEqual(a.noop, {});
			assert.strictEqual(a.noop, a.noop);
		});
	});
});

describe('autobind class decorator: @boundClass', () => {
	const symbol = Symbol('getValue');

	@boundClass
	class A {
		constructor() {
			this.value = 42;
		}

		getValue() {
			return this.value;
		}

		[symbol]() {
			return this.value;
		}
	}

	test('binds methods to an instance', () => {
		const a = new A();
		const {getValue} = a;
		assert(getValue() === 42);
	});

	test('binds method only once', () => {
		const a = new A();
		assert(a.getValue === a.getValue);
	});

	test('ignores non method values', () => {
		assert.doesNotThrow(() => {
			@boundClass
			class A { // eslint-disable-line no-unused-vars
				get value() {
					return 1;
				}
			}
		});
	});

	test('does not override itself when accessed on the prototype', () => {
		A.prototype.getValue; // eslint-disable-line no-unused-expressions

		const a = new A();
		const {getValue} = a;
		assert(getValue() === 42);

		const foo = {
			value: 10,
			getValue: A.prototype.getValue
		};

		assert.strictEqual(foo.getValue(), 10);
	});

	describe('with Reflect', () => {
		describe('with Symbols', () => {
			test('binds methods with symbol keys', () => {
				const a = new A();
				const getValue = a[symbol];
				assert(getValue() === 42);
			});
		});
	});

	describe('without Reflect', () => {
		// Remove Reflect pollyfill
		const _Reflect = Reflect;
		let A;

		beforeEach(() => {
			Reflect = undefined;

			@boundClass
			class B {
				constructor() {
					this.value = 42;
				}

				getValue() {
					return this.value;
				}

				[symbol]() {
					return this.value;
				}
			}
			A = B;
		});

		afterEach(() => {
			Reflect = _Reflect;
		});

		test('falls back to Object.getOwnPropertyNames', () => {
			const a = new A();
			const {getValue} = a;
			assert(getValue() === 42);
		});

		describe('with Symbols', () => {
			test('falls back to Object.getOwnPropertySymbols', () => {
				const a = new A();
				const getValue = a[symbol];
				assert(getValue() === 42);
			});
		});

		describe('without Symbols', () => {
			const _Symbol = Symbol;
			const _getOwnPropertySymbols = Object.getOwnPropertySymbols;
			let A;

			beforeEach(() => {
				Symbol = undefined;
				Object.getOwnPropertySymbols = undefined;

				@boundClass
				class B {
					constructor() {
						this.value = 42;
					}

					getValue() {
						return this.value;
					}
				}
				A = B;
			});

			afterEach(() => {
				Symbol = _Symbol;
				Object.getOwnPropertySymbols = _getOwnPropertySymbols;
			});

			test('does throws no error if Symbol is not supported', () => {
				const a = new A();
				const {getValue} = a;
				assert(getValue() === 42);
			});
		});
	});
});

describe('magical autobind decorator: @autobind', () => {
	describe('method decorator', () => {
		class A {
			constructor() {
				this.value = 42;
			}

			@autobind
			getValue() {
				return this.value;
			}
		}

		test('binds methods to an instance', () => {
			const a = new A();
			const {getValue} = a;
			assert(getValue() === 42);
		});
	});

	describe('class decorator', () => {
		const symbol = Symbol('getValue');

		@autobind
		class A {
			constructor() {
				this.value = 42;
			}

			getValue() {
				return this.value;
			}

			[symbol]() {
				return this.value;
			}
		}

		test('binds methods to an instance', () => {
			const a = new A();
			const {getValue} = a;
			assert(getValue() === 42);
		});
	});
});
