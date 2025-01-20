## 遍历方法比较

在 JavaScript 中，有多种方法可以用于遍历对象和集合，每种方法都有其特定的用途和行为。以下是对常用遍历方法的比较和总结：

1、for...in 循环
用途：遍历对象的可枚举属性。

遍历原型链：是的，for...in 会遍历对象自身的可枚举属性以及其原型链上的可枚举属性。

Symbol 属性：不会遍历 Symbol 属性。

2、for...of 循环
用途：遍历可迭代对象的元素。

遍历原型链：不适用，因为 for...of 主要用于数组、字符串、Map、Set 等可迭代对象，不用于普通对象。

Symbol 属性：不适用，但 for...of 可以遍历 Symbol.iterator 定义的迭代器。

3、Object.keys() 方法
用途：返回对象自身的可枚举属性（不包括原型链）。

遍历原型链：否，仅返回对象自身的属性。

Symbol 属性：不会返回 Symbol 属性。

4、. Object.getOwnPropertyNames() 方法
用途：返回对象自身的所有属性，包括不可枚举属性，但不包括 Symbol 属性。

遍历原型链：否，仅返回对象自身的属性。

5、 Object.getOwnPropertySymbols() 方法
用途：返回对象自身的 Symbol 属性。

遍历原型链：否，仅返回对象自身的 Symbol 属性。

Symbol 属性：是的，返回所有 Symbol 属性。

6、Reflect.ownKeys() 方法
用途：返回对象自身的所有属性，包括 Symbol 属性。

遍历原型链：否，仅返回对象自身的属性。

Symbol 属性：是的，返回所有 Symbol 属性。
 
##  AMD CMD UMD Commonjs ESModule

https://github.com/jtwang7/JavaScript-Note/issues/79

1. AMD（Asynchronous Module Definition）
AMD 是一种用于浏览器环境的模块化规范，主要用于异步加载模块。RequireJS 是 AMD 的一个实现。

特点
异步加载模块，适合浏览器环境。
提供依赖管理，能够在模块加载完成后执行回调。

2. CMD（Common Module Definition）
CMD 是由 SeaJS 推广的一种模块化规范，主要用于浏览器端模块加载。CMD 与 AMD 的区别在于，CMD 推崇依赖就近，延迟执行。

特点
推崇依赖就近，只有在使用时才会加载依赖。
适合浏览器环境

3. UMD（Universal Module Definition）
UMD 是一种兼容 AMD 和 CommonJS 的模块化规范，旨在创建可以在浏览器和 Node.js 环境中运行的模块。

特点
兼容性强，支持 AMD、CommonJS 和全局变量。
适合需要在多种环境中运行的模块。

4. CommonJS
CommonJS 是一种用于服务器端的模块化规范，Node.js 采用了这种规范。CommonJS 模块是同步加载的，适合在服务器端使用。

5. ESModule（ES6 模块）
ESModule 是 ECMAScript 2015（ES6）引入的标准化模块系统，适用于浏览器和服务器端。ESModule 是静态加载的，编译时就能确定模块的依赖关系。

特点
静态加载模块，编译时确定依赖关系。
使用 import 导入模块，使用 export 导出模块。
支持树摇（Tree Shaking）优化，删除未使用的代码。

6. 总结
AMD：异步加载模块，适合浏览器环境，RequireJS 是其实现。
CMD：依赖就近，延迟执行，适合浏览器环境，SeaJS 是其实现。
UMD：兼容 AMD 和 CommonJS，适合需要在多种环境中运行的模块。
CommonJS：同步加载模块，适合服务器端，Node.js 采用。
ESModule：静态加载模块，适用于浏览器和服务器端，是现代 JavaScript 的标准模块系统。