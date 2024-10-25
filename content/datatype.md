# 数据类型
JavaScript 中的数据类型可以分为两大类：基本类型（也称为原始类型）和 引用类型。以下是详细的分类和解释：
基本类型
基本类型是不可变的，直接存储在栈内存中。JavaScript 有 7 种基本类型：

1、Number：表示数字，包括整数和浮点数。

2、String：表示字符串，使用单引号或双引号包裹。

3、Boolean：表示布尔值，true 或 false。

4、Undefined：表示未定义的状态。

5、Null：表示空值。

6、Symbol：表示独一无二的值。

7、BigInt：表示大整数。

BigInt 是 JavaScript 中用于表示任意精度整数的数据类型。与 Number 类型不同，BigInt 可以表示非常大的整数，而不会因为精度问题而丢失信息。
BigInt 的范围
BigInt 的范围实际上是无限的，只受限于可用内存。它可以表示比 Number 类型更大的整数。Number 类型的安全整数范围是 (-2^{53} + 1) 到 (2^{53} - 1)，即 Number.MIN_SAFE_INTEGER 到 Number.MAX_SAFE_INTEGER。


引用类型
引用类型是可变的，存储在堆内存中，变量保存的是对对象的引用。主要包括：

1、Object：表示对象，是键值对的集合。

2、Array：表示数组，是有序的、可变的集合。

3、Function：表示函数，是可执行的代码块。

4、Date：表示日期和时间。

5、RegExp：表示正则表达式，用于模式匹配。

6、Map表示键值对的集合，键可以是任意类型。

7、Set表示一组不重复的值。

8、WeakMap和WeakSet是Map和Set的弱引用版本，垃圾回收时会自动清除不再使用的键值对。

## 类型检测

### 基本类型检测

#### 可以使用 typeof 操作符来检测基本类型和函数类型：

console.log(typeof 42); // 输出: "number"

console.log(typeof "Hello"); // 输出: "string"

console.log(typeof true); // 输出: "boolean"

console.log(typeof undefined); // 输出: "undefined"

console.log(typeof null); // 输出: "object" (这是一个历史遗留问题)

console.log(typeof Symbol('sym')); // 输出: "symbol"

console.log(typeof 1234567890123456789012345678901234567890n); // 输出: "bigint"

console.log(typeof function() {}); // 输出: "function"
### 引用类型检测

#### 对于对象类型，可以使用 instanceof 操作符：

console.log([] instanceof Array); // 输出: true

console.log({} instanceof Object); // 输出: true

console.log(new Date() instanceof Date); // 输出: true

console.log(/regex/ instanceof RegExp); // 输出: true

console.log(new Map() instanceof Map); // 输出: true

console.log(new Set() instanceof Set); // 输出: true

console.log(new WeakMap() instanceof WeakMap); // 输出: true

console.log(new WeakSet() instanceof WeakSet); // 输出: true

#### 使用 Object.prototype.toString.call
Object.prototype.toString.call 方法可以返回对象的类型字符串，这是一种更通用的方法来区分引用类型。

console.log(Object.prototype.toString.call({})); // 输出: "[object Object]"

console.log(Object.prototype.toString.call([])); // 输出: "[object Array]"

console.log(Object.prototype.toString.call(function() {})); // 输出: "[object Function]"

console.log(Object.prototype.toString.call(new Date())); // 输出: "[object Date]"

console.log(Object.prototype.toString.call(/regex/)); // 输出: "[object RegExp]"

console.log(Object.prototype.toString.call(new Map())); // 输出: "[object Map]"

console.log(Object.prototype.toString.call(new Set())); // 输出: "[object Set]"

console.log(Object.prototype.toString.call(new WeakMap())); // 输出: "[object WeakMap]"

console.log(Object.prototype.toString.call(new WeakSet())); // 输出: "[object WeakSet]"

 #### 使用 constructor 属性

每个对象都有一个 constructor 属性，指向创建该对象的构造函数。

console.log({}.constructor === Object); // 输出: true

console.log([].constructor === Array); // 输出: true

console.log((function() {}).constructor === Function); // 输出: true

console.log((new Date()).constructor === Date); // 输出: true

console.log((/regex/).constructor === RegExp); // 输出: true

console.log((new Map()).constructor === Map); // 输出: true

console.log((new Set()).constructor === Set); // 输出: true

console.log((new WeakMap()).constructor === WeakMap); // 输出: true

console.log((new WeakSet()).constructor === WeakSet); // 输出: true




