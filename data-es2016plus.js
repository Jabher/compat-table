var common = require('./data-common');

var babel = common.babel;
var typescript = common.typescript;
var firefox = common.firefox;
var chrome = common.chrome;

exports.name = 'ES2016+';
exports.target_file = 'es2016plus/index.html';
exports.skeleton_file = 'es2016plus/skeleton.html';

exports.tests = [
  {
    name: 'exponentiation (**) operator',
    category: '2016 features',
    significance: 'small',
    spec: 'http://www.ecma-international.org/ecma-262/7.0/index.html#sec-exp-operator',
    subtests: [
      {
        name: 'basic support',
        exec: function () {/*
         return 2 ** 3 === 8 && -(5 ** 2) === -25 && (-5) ** 2 === 25;
         */},
        res: {
          tr: true,
          babel: true,
          closure: true,
          typescript: true,
          edge13: "flagged",
          edge14: true,
          firefox42: firefox.nightly,
          firefox52: true,
          chrome51: "flagged",
          chrome52: true,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'assignment',
        exec: function () {/*
         var a = 2; a **= 3; return a === 8;
         */},
        res: {
          tr: true,
          babel: true,
          closure: true,
          typescript: true,
          edge13: "flagged",
          edge14: true,
          firefox48: firefox.nightly,
          firefox52: true,
          chrome51: "flagged",
          chrome52: true,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'early syntax error for unary negation without parens',
        exec: function () {/*
         if (2 ** 3 !== 8) { return false; }
         try {
         Function("-5 ** 2")();
         } catch(e) {
         return true;
         }
         */},
        res: {
          babel: true,
          closure: true,
          edge14: true,
          firefox52: true,
          chrome51: "flagged",
          chrome52: true,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
    ],
  },
  {
    name: 'Object static methods',
    spec: 'https://tc39.github.io/ecma262/#sec-properties-of-the-object-constructor',
    category: '2017 features',
    significance: 'medium',
    subtests: [
      {
        name: 'Object.values',
        spec: 'https://tc39.github.io/ecma262/#sec-properties-of-the-object-constructor',
        category: '2017 features',
        significance: 'medium',
        exec: function () {/*
         var obj = Object.create({ a: "qux", d: "qux" });
         obj.a = "foo"; obj.b = "bar"; obj.c = "baz";
         var v = Object.values(obj);
         return Array.isArray(v) && String(v) === "foo,bar,baz";
         */},
        res: {
          babel: true,
          es7shim: true,
          typescript: typescript.corejs,
          firefox45: firefox.nightly,
          firefox47: true,
          chrome51: "flagged",
          chrome54: true,
          edge14: true,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Object.entries',
        exec: function () {/*
         var obj = Object.create({ a: "qux", d: "qux" });
         obj.a = "foo"; obj.b = "bar"; obj.c = "baz";
         var e = Object.entries(obj);
         return Array.isArray(e)
         && e.length === 3
         && String(e[0]) === "a,foo"
         && String(e[1]) === "b,bar"
         && String(e[2]) === "c,baz";
         */},
        res: {
          babel: true,
          es7shim: true,
          typescript: typescript.corejs,
          firefox45: firefox.nightly,
          firefox47: true,
          chrome51: "flagged",
          chrome54: true,
          edge14: true,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Object.getOwnPropertyDescriptors',
        exec: function () {/*
          var object = {a: 1};
          var B = typeof Symbol === 'function' ? Symbol('b') : 'b';
          object[B] = 2;
          var O = Object.defineProperty(object, 'c', {value: 3});
          var D = Object.getOwnPropertyDescriptors(O);

          return D.a.value === 1 && D.a.enumerable === true && D.a.configurable === true && D.a.writable === true
          && D[B].value === 2 && D[B].enumerable === true && D[B].configurable === true && D[B].writable === true
          && D.c.value === 3 && D.c.enumerable === false && D.c.configurable === false && D.c.writable === false;
          */},
        res: {
          babel: true,
          es7shim: true,
          typescript: typescript.corejs,
          edge15: true,
          chrome51: "flagged",
          chrome54: true,
          firefox50: true,
          safari10: true,
          safaritp: true,
          webkit: true,
        },
      },
      {
        name: "Object.getOwnPropertyDescriptors doesn't provide undefined descriptors",
        exec: function () {/*
          var P = new Proxy({a:1}, {
            getOwnPropertyDescriptor: function(t, k) {}
          });
          return !Object.getOwnPropertyDescriptors(P).hasOwnProperty('a');
        */},
        res: {
          edge15: true,
          firefox50: true,
          chrome54: true,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        },
      },
    ],
  },
  {
    name: 'Array.prototype.includes',
    spec: 'http://www.ecma-international.org/ecma-262/7.0/index.html#sec-array.prototype.includes',
    category: '2016 features',
    significance: 'small',
    subtests: [
      {
        name: 'Array.prototype.includes',
        exec: function(){/*
         return [1, 2, 3].includes(1)
         && ![1, 2, 3].includes(4)
         && ![1, 2, 3].includes(1, 1)
         && [NaN].includes(NaN)
         && Array(1).includes();
         */},
        res: {
          babel: true,
          es7shim: true,
          typescript: typescript.corejs,
          safari9: true,
          safaritp: true,
          webkit: true,
          chrome47: true,
          edge14: true,
          firefox43: true,
        }
      },
      {
        name: 'Array.prototype.includes is generic',
        exec: function(){/*
         var passed = 0;
         return [].includes.call({
         get "0"() {
         passed = NaN;
         return 'foo';
         },
         get "11"() {
         passed += 1;
         return 0;
         },
         get "19"() {
         passed += 1;
         return 'foo';
         },
         get "21"() {
         passed = NaN;
         return 'foo';
         },
         get length() {
         passed += 1;
         return 24;
         }
         }, 'foo', 6) === true && passed === 3;
         */},
        res: {
          babel: true,
          es7shim: true,
          typescript: typescript.corejs,
          safari9: true,
          safaritp: true,
          webkit: true,
          chrome47: true,
          edge14: true,
          firefox43: true,
        }
      },
      {
        name: '%TypedArray%.prototype.includes',
        exec: function(){/*
         return [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array,
         Int32Array, Uint32Array, Float32Array, Float64Array].every(function(TypedArray){
         return new TypedArray([1, 2, 3]).includes(1)
         && !new TypedArray([1, 2, 3]).includes(4)
         && !new TypedArray([1, 2, 3]).includes(1, 1);
         });
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          chrome47: true,
          edge14: true,
          firefox43: true,
          safaritp: true,
          safari10: true,
          webkit: true,
        }
      },
    ],
  },
  {
    name: 'String padding',
    category: '2017 features',
    significance: 'small',
    spec: 'https://github.com/tc39/proposal-string-pad-start-end',
    subtests: [
      {
        name: 'String.prototype.padStart',
        exec: function(){/*
         return 'hello'.padStart(10) === '     hello'
         && 'hello'.padStart(10, '1234') === '12341hello'
         && 'hello'.padStart() === 'hello'
         && 'hello'.padStart(6, '123') === '1hello';
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          es7shim: true,
          firefox48: true,
          edge14: "flagged",
          edge15: true,
          chrome52: "flagged",
          chrome57: true,
          safari10: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'String.prototype.padEnd',
        exec: function(){/*
         return 'hello'.padEnd(10) === 'hello     '
         && 'hello'.padEnd(10, '1234') === 'hello12341'
         && 'hello'.padEnd() === 'hello'
         && 'hello'.padEnd(6, '123') === 'hello1';
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          es7shim: true,
          firefox48: true,
          edge14: "flagged",
          edge15: true,
          chrome52: "flagged",
          chrome57: true,
          safari10: true,
          safaritp: true,
          webkit: true,
        }
      }
    ]
  },
  {
    name: 'trailing commas in function syntax',
    spec: 'https://github.com/tc39/proposal-trailing-function-commas',
    category: '2017 features',
    significance: 'small',
    subtests: [
      {
        name: 'in parameter lists',
        exec: function(){/*
          return typeof function f( a, b, ){} === 'function';
        */},
        res: {
          babel: true,
          typescript: true,
          edge14: true,
          chrome57: "flagged",
          chrome58: true,
          firefox52: true,
          safari10: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'in argument lists',
        exec: function(){/*
          return Math.min(1,2,3,) === 1;
        */},
        res: {
          babel: true,
          typescript: true,
          edge14: true,
          chrome57: "flagged",
          chrome58: true,
          firefox52: true,
          safari10: true,
          safaritp: true,
          webkit: true,
        }
      },
    ],
  },
  {
    name: 'async functions',
    category: '2017 features',
    significance: 'large',
    spec: 'https://tc39.github.io/ecmascript-asyncawait/',
    subtests: [
      {
        // Should test that async functions return promises
        // that (without await) resolve to the returned value.
        name: 'return',
        exec: function () {/*
          async function a(){
            return "foo";
          }
          var p = a();
          if (!(p instanceof Promise)) {
            return false;
          }
          p.then(function(result) {
            if (result === "foo") {
              asyncTestPassed();
            }
          });
        */},
        res: {
          tr: true,
          babel: babel.regenerator,
          closure: true,
          typescript: typescript.asyncawait,
          chrome52: "flagged",
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'throw',
        exec: function () {/*
          async function a(){
            throw "foo";
          }
          var p = a();
          if (!(p instanceof Promise)) {
            return false;
          }
          p.catch(function(result) {
            if (result === "foo") {
              asyncTestPassed();
            }
          });
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'no line break between async and function',
        exec: function () {/*
          async function a(){}
          try { Function("async\n function a(){}")(); } catch(e) { return true; }
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: false,
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'no "prototype" property',
        exec: function(){/*
          async function a(){};
          return !a.hasOwnProperty("prototype");
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        },
      },
      {
        name: 'await',
        exec: function () {/*
          (async function (){
            await Promise.resolve();
            var a1 = await new Promise(function(resolve) { setTimeout(resolve,800,"foo"); });
            var a2 = await new Promise(function(resolve) { setTimeout(resolve,800,"bar"); });
            if (a1 + a2 === "foobar") {
              asyncTestPassed();
            }
          }());
        */},
        res: {
          tr: true,
          babel: babel.regenerator,
          closure: true,
          typescript: typescript.asyncawait,
          chrome52: "flagged",
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'await, rejection',
        exec: function () {/*
          (async function (){
            await Promise.resolve();
            try {
              var a1 = await new Promise(function(_, reject) { setTimeout(reject,800,"foo"); });
            } catch(e) {
              if (e === "foo") {
                asyncTestPassed();
              }
            }
          }());
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'must await a value',
        exec: function () {/*
          async function a(){ await Promise.resolve(); }
          try { Function("(async function a(){ await; }())")(); } catch(e) { return true; }
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'can await non-Promise values',
        exec: function () {/*
          (async function (){
            await Promise.resolve();
            var e = await "foo";
            if (e === "foo") {
              asyncTestPassed();
            }
          }());
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'cannot await in parameters',
        exec: function () {/*
          async function a(){ await Promise.resolve(); }
          try { Function("(async function a(b = await Promise.resolve()){}())")(); } catch(e) { return true; }
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'async methods, object literals',
        exec: function () {/*
          var o = {
            async a(){ return await Promise.resolve("foo"); }
          };
          var p = o.a();
          if (!(p instanceof Promise)) {
            return false;
          }
          p.then(function(result) {
            if (result === "foo") {
              asyncTestPassed();
            }
          });
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'async methods, classes',
        exec: function () {/*
          class C {
            async a(){ return await Promise.resolve("foo"); }
          };
          var p = new C().a();
          if (!(p instanceof Promise)) {
            return false;
          }
          p.then(function(result) {
            if (result === "foo") {
              asyncTestPassed();
            }
          });
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'async arrow functions',
        exec: function () {/*
          var a = async () => await Promise.resolve("foo");
          var p = a();
          if (!(p instanceof Promise)) {
            return false;
          }
          p.then(function(result) {
            if (result === "foo") {
              asyncTestPassed();
            }
          });
        */},
        res: {
          tr: true,
          babel: babel.regenerator,
          closure: true,
          typescript: false, // still buggy output
          chrome52: "flagged",
          chrome55: true,
          edge13: "flagged",
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        }
      },
      {
        name: 'correct prototype chain',
        exec: function() {/*
          var asyncFunctionProto = Object.getPrototypeOf(async function (){});
          return asyncFunctionProto !== function(){}.prototype
            && Object.getPrototypeOf(asyncFunctionProto) === Function.prototype;
          return passed;
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: false,
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        },
      },
      {
        name: 'async function prototype, Symbol.toStringTag',
        exec: function() {/*
          return Object.getPrototypeOf(async function (){})[Symbol.toStringTag] == "AsyncFunction";
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: false,
          edge14: false,
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        },
      },
      {
        name: 'async function constructor',
        exec: function() {/*
          var a = async function (){}.constructor("return 'foo';");
          var p = a();
          if (!(p instanceof Promise)) {
            return false;
          }
          p.then(function(result) {
            if (result === "foo") {
              asyncTestPassed();
            }
          });
        */},
        res: {
          tr: null,
          babel: null,
          closure: null,
          typescript: null,
          chrome52: null,
          chrome55: true,
          edge13: false,
          edge14: "flagged",
          edge15: "flagged",
          firefox52: true,
          safari10_1: true,
          safaritp: true,
        },
      },
    ]
  },
  {
    name: 'shared memory and atomics',
    category: '2017 features',
    significance: 'medium',
    spec: 'https://github.com/tc39/ecmascript_sharedmem',
    'subtests': [
      {
        name: 'SharedArrayBuffer',
        exec: function () {/*
         return typeof SharedArrayBuffer === 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'SharedArrayBuffer[Symbol.species]',
        exec: function () {/*
         return SharedArrayBuffer[Symbol.species] === SharedArrayBuffer;
         */},
        res: {
          firefox52: true,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'SharedArrayBuffer.prototype.byteLength',
        exec: function () {/*
         return 'byteLength' in SharedArrayBuffer.prototype;
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          webkit: true,
        }
      },
      {
        name: 'SharedArrayBuffer.prototype.slice',
        exec: function () {/*
         return typeof SharedArrayBuffer.prototype.slice === 'function';
         */},
        res: {
          firefox52: true,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'SharedArrayBuffer.prototype[Symbol.toStringTag]',
        exec: function () {/*
         return SharedArrayBuffer.prototype[Symbol.toStringTag] === 'SharedArrayBuffer';
         */},
        res: {
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.add',
        exec: function () {/*
         return typeof Atomics.add == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.and',
        exec: function () {/*
         return typeof Atomics.and == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.compareExchange',
        exec: function () {/*
         return typeof Atomics.compareExchange == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.exchange',
        exec: function () {/*
         return typeof Atomics.exchange == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.wait',
        exec: function () {/*
         return typeof Atomics.wait == 'function';
         */},
        res: {
          firefox48: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.wake',
        exec: function () {/*
         return typeof Atomics.wake == 'function';
         */},
        res: {
          firefox48: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.isLockFree',
        exec: function () {/*
         return typeof Atomics.isLockFree == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.load',
        exec: function () {/*
         return typeof Atomics.load == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.or',
        exec: function () {/*
         return typeof Atomics.or == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.store',
        exec: function () {/*
         return typeof Atomics.store == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.sub',
        exec: function () {/*
         return typeof Atomics.sub == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: 'Atomics.xor',
        exec: function () {/*
         return typeof Atomics.xor == 'function';
         */},
        res: {
          firefox46: firefox.nightly,
          firefox51: firefox.developer,
          firefox52: true,
          chrome48: chrome.sharedmem,
          safari10_1: true,
          safaritp: true,
          webkit: true,
        }
      }
    ]
  },
  {
    name: 'generator functions can\'t be used with "new"',
    category: '2016 misc',
    significance: 'tiny',
    spec: 'http://www.ecma-international.org/ecma-262/7.0/index.html#sec-createdynamicfunction',
    links: [
      {
        note_id: 'new-gen-fn',
        note_html: '<a href="https://github.com/rwaldron/tc39-notes/blob/master/es7/2015-07/july-28.md#67-new--generatorfunction">TC39 meeting notes from July 28, 2015.</a>',
      }
    ],
    exec: function(){/*
     function * generator() {
     yield 3;
     }
     try {
     new generator();
     } catch(e) {
     return true;
     }
     */},
    res: {
      edge13: true,
      firefox43: true,
      chrome50: true,
      safari10: true,
      safaritp: true,
      webkit: true,
    }
  },
  {
    name: 'generator throw() caught by inner generator',
    category: '2016 misc',
    significance: 'tiny',
    spec: 'http://www.ecma-international.org/ecma-262/7.0/index.html#sec-generatorfunction-objects',
    links: [
      {
        note_id: 'gen-throw',
        note_html: '<a href="https://github.com/tc39/ecma262/issues/293">\'Semantics of yield* in throw case\' GitHub issue in ECMA-262 repo.</a>',
      }
    ],
    exec: function(){/*
     function * generator() {
     yield * (function * () {
     try {
     yield 'foo';
     }
     catch(e) {
     return;
     }
     }());
     yield 'bar';
     }
     var iter = generator();
     iter.next();
     return iter['throw']().value === 'bar';
     */},
    res: {
      closure: true,
      edge14: true,
      firefox27: true,
      chrome39: true,
      node012: "flagged",
      node4: true,
      safari10: true,
      safaritp: true,
      webkit: true,
    }
  },
  {
    name: 'strict fn w/ non-strict non-simple params is error',
    category: '2016 misc',
    significance: 'tiny',
    spec: 'http://www.ecma-international.org/ecma-262/7.0/index.html#sec-functiondeclarationinstantiation',
    links: [
      {
        note_id: 'strict-fn-non-strict-params',
        note_html: '<a href="https://github.com/rwaldron/tc39-notes/blob/master/es7/2015-07/july-29.md#611-the-scope-of-use-strict-with-respect-to-destructuring-in-parameter-lists">TC39 meeting notes from July 29, 2015.</a>',
      },
    ],
    exec: function(){/*
     function foo(...a){}
     try {
     Function("function bar(...a){'use strict';}")();
     } catch(e) {
     return true;
     }
     */},
    res: {
      edge12: true,
      firefox52: true,
      chrome47: true,
      safari10: true,
      safaritp: true,
      webkit: true,
    }
  },
  {
    name: 'nested rest destructuring, declarations',
    category: '2016 misc',
    significance: 'tiny',
    spec: 'http://www.ecma-international.org/ecma-262/7.0/index.html#sec-destructuring-assignment',
    links: [
      {
        note_id: 'nested-rest-destruct-decl',
        note_html: '<a href="https://github.com/rwaldron/tc39-notes/blob/master/es7/2015-07/july-28.md#66-bindingrestelement-should-allow-a-bindingpattern-ala-assignmentrestelement">TC39 meeting notes from July 28, 2015.</a>',
      }
    ],
    exec: function(){/*
     var [x, ...[y, ...z]] = [1,2,3,4];
     return x === 1 && y === 2 && z + '' === '3,4';
     */},
    res: {
      babel: true,
      closure: true,
      edge13: "flagged",
      edge14: true,
      firefox47: true,
      safari10_1: true,
      typescript: true,
      chrome49: true,
      safaritp: true,
      webkit: true,
    }
  },
  {
    name: 'nested rest destructuring, parameters',
    category: '2016 misc',
    significance: 'tiny',
    spec: 'http://www.ecma-international.org/ecma-262/7.0/index.html#sec-destructuring-assignment',
    links: [
      {
        note_id: 'nested-rest-destruct-params',
        note_html: '<a href="https://github.com/rwaldron/tc39-notes/blob/master/es7/2015-07/july-28.md#66-bindingrestelement-should-allow-a-bindingpattern-ala-assignmentrestelement">TC39 meeting notes from July 28, 2015.</a>',
      },
    ],
    exec: function(){/*
     return function([x, ...[y, ...z]]) {
     return x === 1 && y === 2 && z + '' === '3,4';
     }([1,2,3,4]);
     */},
    res: {
      babel: true,
      closure: true,
      edge13: "flagged",
      edge14: true,
      firefox47: true,
      typescript: true,
      chrome49: true,
      safari10_1: true,
      safaritp: true,
      webkit: true,
    }
  },
  {
    name: 'Proxy, "enumerate" handler removed',
    category: '2016 misc',
    significance: 'tiny',
    spec: 'http://www.ecma-international.org/ecma-262/7.0/index.html#sec-proxy-objects',
    links: [
      {
        note_id: 'proxy-enumerate-removed',
        note_html: '<a href="https://github.com/tc39/ecma262/pull/367">\'Normative: Remove [[Enumerate]] and associated reflective capabilities\' GitHub Pull Request in ECMA-262 repo.</a>',
      },
    ],
    exec: function() {/*
     var passed = true;
     var proxy = new Proxy({}, {
     enumerate: function() {
     passed = false;
     }
     });
     for(var key in proxy); // Should not throw, nor execute the 'enumerate' method.
     return passed;
     */},
    res: {
      edge15: true,
      firefox18: true,
      firefox25: false,
      firefox47: true,
      chrome50: true,
      safari10: true,
      safaritp: true,
      webkit: true,
    },
  },
  {
    name: 'Proxy internal calls, Array.prototype.includes',
    category: '2016 misc',
    significance: 'tiny',
    spec: 'http://www.ecma-international.org/ecma-262/7.0/index.html#sec-array.prototype.includes',
    exec: function() {/*
     // Array.prototype.includes -> Get -> [[Get]]
     var get = [];
     var p = new Proxy({length: 3, 0: '', 1: '', 2: '', 3: ''}, { get: function(o, k) { get.push(k); return o[k]; }});
     Array.prototype.includes.call(p, {});
     if (get + '' !== "length,0,1,2") return;

     get = [];
     p = new Proxy({length: 4, 0: NaN, 1: '', 2: NaN, 3: ''}, { get: function(o, k) { get.push(k); return o[k]; }});
     Array.prototype.includes.call(p, NaN, 1);
     return (get + '' === "length,1,2");
     */},
    res: {
      firefox43: true,
      chrome49: true,
      edge14: true,
      safari10: true,
      safaritp: true,
      webkit: true,
    },
  },
  {
    name: 'Object.prototype getter/setter methods',
    spec: 'https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__',
    category: '2017 annex b',
    significance: 'tiny',
    subtests: [{
      name: '__defineGetter__',
      exec: function () {/*
       var obj = {};
       function bar() { return "bar"; }
       Object.prototype.__defineGetter__.call(obj, "foo", bar);
       var prop = Object.getOwnPropertyDescriptor(obj, "foo");
       return prop.get === bar && !prop.writable && prop.configurable
       && prop.enumerable;
       */},
      res: {
        babel: true,
        typescript: typescript.corejs,
        ie11: true,
        firefox4: true,
        chrome30: true,
        node012: true,
        iojs: true,
        safari51: true,
        safari9: true,
        safaritp: true,
        webkit: true,
        android40: true,
        ios51: true,
      }
    },
      {
        name: '__defineGetter__, symbols',
        exec: function () {/*
         var obj = {};
         var sym = Symbol();
         function bar() { return "bar"; }
         Object.prototype.__defineGetter__.call(obj, sym, bar);
         var prop = Object.getOwnPropertyDescriptor(obj, sym);
         return prop.get === bar && !prop.writable && prop.configurable
         && prop.enumerable;
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          edge12: true,
          firefox36: true,
          chrome30: "flagged",
          chrome38: true,
          node012: true,
          iojs: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          android40: true,
        }
      },
      {
        name: '__defineGetter__, ToObject(this)',
        exec: function () {/*
         var key = '__accessors_test__';
         __defineGetter__.call(1, key, function(){});
         try {
         __defineGetter__.call(null, key, function(){});
         } catch(e){
         return true;
         }
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          firefox48: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
        },
      },
      {
        name: '__defineSetter__',
        exec: function () {/*
         var obj = {};
         function bar() {}
         Object.prototype.__defineSetter__.call(obj, "foo", bar);
         var prop = Object.getOwnPropertyDescriptor(obj, "foo");
         return prop.set === bar && !prop.writable && prop.configurable
         && prop.enumerable;
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          ie11: true,
          firefox4: true,
          chrome30: true,
          node012: true,
          iojs: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          android40: true,
          ios51: true,
        },
      },
      {
        name: '__defineSetter__, symbols',
        exec: function () {/*
         var obj = {};
         var sym = Symbol();
         function bar(baz) {}
         Object.prototype.__defineSetter__.call(obj, sym, bar);
         var prop = Object.getOwnPropertyDescriptor(obj, sym);
         return prop.set === bar && !prop.writable && prop.configurable
         && prop.enumerable;
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          edge12: true,
          firefox36: true,
          chrome30: "flagged",
          chrome38: true,
          node012: true,
          iojs: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          android40: true,
        },
      },
      {
        name: '__defineSetter__, ToObject(this)',
        exec: function () {/*
         var key = '__accessors_test__';
         __defineSetter__.call(1, key, function(){});
         try {
         __defineSetter__.call(null, key, function(){});
         } catch(e){
         return true;
         }
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          firefox48: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
        },
      },
      {
        name: '__lookupGetter__',
        exec: function () {/*
         var obj = {
         get foo() { return "bar"},
         qux: 1
         };
         var foo = Object.prototype.__lookupGetter__.call(obj, "foo");
         return foo() === "bar"
         && Object.prototype.__lookupGetter__.call(obj, "qux") === undefined
         && Object.prototype.__lookupGetter__.call(obj, "baz") === undefined;
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          ie11: true,
          firefox2: true,
          chrome30: true,
          node012: true,
          iojs: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          android40: true,
          ios51: true,
        },
      },
      {
        name: '__lookupGetter__, prototype chain',
        exec: function () {/*
         var obj = {
         get foo() { return "bar"},
         qux: 1
         };
         var foo = Object.prototype.__lookupGetter__.call(Object.create(obj), "foo");
         return foo() === "bar"
         && Object.prototype.__lookupGetter__.call(obj, "qux") === undefined
         && Object.prototype.__lookupGetter__.call(obj, "baz") === undefined;
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          ie11: true,
          firefox4: true,
          chrome30: true,
          node012: true,
          iojs: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          android40: true,
          ios51: true,
        },
      },
      {
        name: '__lookupGetter__, symbols',
        exec: function () {/*
         var sym = Symbol();
         var sym2 = Symbol();
         var obj = {};
         Object.defineProperty(obj, sym, { get: function() { return "bar"; }});
         Object.defineProperty(obj, sym2, { value: 1 });
         var foo = Object.prototype.__lookupGetter__.call(obj, sym);
         return foo() === "bar"
         && Object.prototype.__lookupGetter__.call(obj, sym2) === undefined
         && Object.prototype.__lookupGetter__.call(obj, Symbol()) === undefined;
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          edge12: true,
          firefox36: true,
          chrome30: "flagged",
          chrome38: true,
          node012: true,
          iojs: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          android40: true,
        },
      },
      {
        name: '__lookupGetter__, ToObject(this)',
        exec: function () {/*
         __lookupGetter__.call(1, 'key');
         try {
         __lookupGetter__.call(null, 'key');
         } catch(e){
         return true;
         }
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          ie11: true,
          firefox24: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
        },
      },
      {
        name: '__lookupGetter__, data properties can shadow accessors',
        exec: function () {/*
         var a = { };
         var b = Object.create(a);
         b.foo = 1;
         a.__defineGetter__("foo", function () {})
         return b.__lookupGetter__("foo") === undefined
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          firefox4: true,
          chrome57: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          ios51: true,
        },
      },
      {
        name: '__lookupSetter__',
        exec: function () {/*
         var obj = {
         set foo(baz) { return "bar"; },
         qux: 1
         };
         var foo = Object.prototype.__lookupSetter__.call(obj, "foo");
         return foo() === "bar"
         && Object.prototype.__lookupSetter__.call(obj, "qux") === undefined
         && Object.prototype.__lookupSetter__.call(obj, "baz") === undefined;
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          ie11: true,
          firefox2: true,
          chrome30: true,
          node012: true,
          iojs: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          android40: true,
          ios51: true,
        },
      },
      {
        name: '__lookupSetter__, prototype chain',
        exec: function () {/*
         var obj = {
         set foo(baz) { return "bar"; },
         qux: 1
         };
         var foo = Object.prototype.__lookupSetter__.call(Object.create(obj), "foo");
         return foo() === "bar"
         && Object.prototype.__lookupSetter__.call(obj, "qux") === undefined
         && Object.prototype.__lookupSetter__.call(obj, "baz") === undefined;
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          ie11: true,
          firefox4: true,
          chrome30: true,
          node012: true,
          iojs: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          android40: true,
          ios51: true,
        },
      },
      {
        name: '__lookupSetter__, symbols',
        exec: function () {/*
         var sym = Symbol();
         var sym2 = Symbol();
         var obj = {};
         Object.defineProperty(obj, sym, { set: function(baz) { return "bar"; }});
         Object.defineProperty(obj, sym2, { value: 1 });
         var foo = Object.prototype.__lookupSetter__.call(obj, sym);
         return foo() === "bar"
         && Object.prototype.__lookupSetter__.call(obj, sym2) === undefined
         && Object.prototype.__lookupSetter__.call(obj, Symbol()) === undefined;
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          edge12: true,
          firefox36: true,
          chrome30: "flagged",
          chrome38: true,
          node012: true,
          iojs: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          android40: true,
        },
      },
      {
        name: '__lookupSetter__, ToObject(this)',
        exec: function () {/*
         __lookupSetter__.call(1, 'key');
         try {
         __lookupSetter__.call(null, 'key');
         } catch(e){
         return true;
         }
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          ie11: true,
          firefox24: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
        },
      },
      {
        name: '__lookupSetter__, data properties can shadow accessors',
        exec: function () {/*
         var a = { };
         var b = Object.create(a);
         b.foo = 1;
         a.__defineSetter__("foo", function () {})
         return b.__lookupSetter__("foo") === undefined
         */},
        res: {
          babel: true,
          typescript: typescript.corejs,
          firefox4: true,
          chrome57: true,
          safari51: true,
          safari9: true,
          safaritp: true,
          webkit: true,
          ios51: true,
        },
      }
    ]
  },
  {
    name: 'Proxy internal calls, getter/setter methods',
    spec: 'https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__',
    category: '2017 annex b',
    significance: 'tiny',
    subtests: [{
      name: '__defineGetter__',
      exec: function () {/*
       // Object.prototype.__defineGetter__ -> DefinePropertyOrThrow -> [[DefineOwnProperty]]
       var def = [];
       var p = new Proxy({}, { defineProperty: function(o, v, desc) { def.push(v); Object.defineProperty(o, v, desc); return true; }});
       Object.prototype.__defineGetter__.call(p, "foo", Object);
       return def + '' === "foo";
       */},
      res: {
        firefox18: true,
        edge13: true,
        chrome52: true,
        safari10: true,
        safaritp: true,
        webkit: true,
      }
    },
      {
        name: '__defineSetter__',
        exec: function () {/*
         // Object.prototype.__defineSetter__ -> DefinePropertyOrThrow -> [[DefineOwnProperty]]
         var def = [];
         var p = new Proxy({}, { defineProperty: function(o, v, desc) { def.push(v); Object.defineProperty(o, v, desc); return true; }});
         Object.prototype.__defineSetter__.call(p, "foo", Object);
         return def + '' === "foo";
         */},
        res: {
          firefox18: true,
          edge13: true,
          chrome52: true,
          safari10: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: '__lookupGetter__',
        exec: function () {/*
         // Object.prototype.__lookupGetter__ -> [[GetOwnProperty]]
         // Object.prototype.__lookupGetter__ -> [[GetPrototypeOf]]
         var gopd = [];
         var gpo = false;
         var p = new Proxy({}, {
         getPrototypeOf: function(o) { gpo = true; return Object.getPrototypeOf(o); },
         getOwnPropertyDescriptor: function(o, v) { gopd.push(v); return Object.getOwnPropertyDescriptor(o, v); }
         });
         Object.prototype.__lookupGetter__.call(p, "foo");
         return gopd + '' === "foo" && gpo;
         */},
        res: {
          edge14: true,
          chrome57: true,
          firefox49: true,
          safari10: true,
          safaritp: true,
          webkit: true,
        }
      },
      {
        name: '__lookupSetter__',
        exec: function () {/*
         // Object.prototype.__lookupSetter__ -> [[GetOwnProperty]]
         // Object.prototype.__lookupSetter__ -> [[GetPrototypeOf]]
         var gopd = [];
         var gpo = false;
         var p = new Proxy({}, {
         getPrototypeOf: function(o) { gpo = true; return Object.getPrototypeOf(o); },
         getOwnPropertyDescriptor: function(o, v) { gopd.push(v); return Object.getOwnPropertyDescriptor(o, v); }
         });
         Object.prototype.__lookupSetter__.call(p, "foo");
         return gopd + '' === "foo" && gpo;
         */},
        res: {
          edge14: true,
          chrome57: true,
          firefox49: true,
          safari10: true,
          safaritp: true,
          webkit: true,
        }
      }
    ]
  },
  {
    name: 'Proxy "ownKeys" handler, duplicate keys for non-extensible targets',
    category: '2017 misc',
    significance: 'tiny',
    spec: 'https://github.com/tc39/ecma262/pull/594',
    exec: function() {/*
     var P = new Proxy(Object.preventExtensions(Object.defineProperty({a:1}, "b", {value:1})), {
     ownKeys: function() {
     return ['a','a','b','b'];
     }
     });
     return Object.getOwnPropertyNames(P) + '' === "a,a,b,b";
     */},
    res: {
      firefox51: true,
      chrome51: true,
      safari10: true,
      safari10_1: true,
      safaritp: true,
      webkit: true,
    },
  },
  {
    name: 'RegExp "u" flag, case folding',
    category: '2017 misc',
    significance: 'tiny',
    spec: 'https://github.com/tc39/ecma262/pull/525',
    exec: function() {/*
     return "ſ".match(/\w/iu) && !"ſ".match(/\W/iu)
     && "\u212a".match(/\w/iu) && !"\u212a".match(/\W/iu)
     && "\u212a".match(/.\b/iu) && "ſ".match(/.\b/iu)
     && !"\u212a".match(/.\B/iu) && !"ſ".match(/.\B/iu);
     */},
    res: {
      firefox54: true,
      safari10: true,
      safari10_1: true,
      safaritp: true,
      webkit: true,
    },
  },
  {
    name: 'assignments allowed in for-in head in non-strict mode',
    spec: 'https://tc39.github.io/ecma262/#sec-initializers-in-forin-statement-heads',
    category: '2017 annex b',
    significance: 'tiny',
    exec: function(){/*
     for (var i = 0 in {}) {}
     return i === 0;
     */},
    res: {
      tr: true,
      ie10: true,
      edge12: true,
      firefox2: true,
      firefox31: true,
      firefox40: false,
      firefox52: true,
      chrome30: true,
      safari51: true,
      safari9: false,
      safari10_1: true,
      safaritp: true,
      webkit: true,
      node012: true,
      android40: true,
      ios51: true,
    },
  },
  {
    name: 'arguments.caller removed',
    category: '2017 misc',
    significance: 'tiny',
    spec: 'https://github.com/tc39/ecma262/pull/689',
    exec: function() {/*
     return (function(){
       'use strict';
       return !Object.getOwnPropertyDescriptor(arguments,'caller');
     })();
     */},
    res: {
      chrome56: true,
      safari10_1: true,
      safaritp: true,
      firefox53: true,
    },
  },
];

//Shift annex B features to the bottom
exports.tests = exports.tests.reduce(function(a,e) {
  var index = ['2016 features', '2016 misc', '2017 features', '2017 misc', '2017 annex b', 'finished (stage 4)'].indexOf(e.category);
  if (index === -1) {
    console.log('"' + a.category + '" is not an ES2016+ category!');
  }
  (a[index] = a[index] || []).push(e);
  return a;
},[]).reduce(function(a,e) {
  return a.concat(e);
},[]);
