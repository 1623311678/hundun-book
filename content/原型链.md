# 原型链

ECMA-262 把原型链定义为 ECMAScript 的主要继承方式。其基本思想就是通过原型继承多个引用
类型的属性和方法。重温一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型有
一个属性指回构造函数，而实例有一个内部指针指向原型。如果原型是另一个类型的实例呢？那就意味
着这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函
数。这样就在实例和原型之间构造了一条原型链。这就是原型链的基本构想。

### 原型链继承

所有实例都会共享原型的属性

```javascript
 // 原型链继承
 // Persion.prototype 指向一个对象
 // 这个对象包含一个指向原型的指针
 // 即 Persion.prototype.constructor === Persion
   function Persion(){
     this.name = '人类'
   }
   function Student(){
     this.age = 0
   }
   Student.prototype = new Persion()
   const stu = new Student()
   // stu.__proto__ === Student.prototype
   console.log(stu.name)
```
### 构造函数继承

构造函数的主要缺点，也是使用构造函数模式自定义类型的问题：必须在构造函数中定义方法，

因此函数不能重用。此外，子类也不能访问父类原型上定义的方法，因此所有类型只能使用构造函数模

式。由于存在这些问题，盗用构造函数基本上也不能单独使用

```javascript
   // 构造函数继承
   function Persion(){
     this.name = '人类'
   }
   function Student(){
     Persion.call(this);
     this.age = 0
   }
   const stu = new Student()
   stu.name = '学生'
   console.log(stu.name)
```

### 组合继承

```javascript

   // 组合继承
   function Persion(){
     this.name = '人类'
   }
   function Student(){
     Persion.call(this);
     this.age = 0
   }
   Student.prototype = new Persion()
   Student.prototype.constructor = Student; // 修正 Student.prototype.constructor 指向 Student
   const stu = new Student()
   stu.name = '学生'
   console.log(stu.name)
```

### 原型式继承

原型式继承是一种不使用构造函数的继承方式，主要通过创建一个临时的构造函数并将其原型指向要继承的对象来实现

```javascript
// 定义一个对象 Persion
const Persion = {
  name: '人类'
};

// 创建一个新对象 Student，并将其原型指向 Persion
const Student = Object.create(Persion);
Student.age = 0;

// 创建 Student 的实例 stu
const stu = Object.create(Student);

// stu.__proto__ === Student
console.log(stu.name); // 输出 '人类'

```

### 寄生式继承

```javascript
// 定义一个对象 Persion
const Persion = {
  name: '人类'
};

// 创建一个工厂函数，用于创建继承自 Persion 的对象
function createStudent() {
  // 创建一个继承自 Persion 的新对象
  const student = Object.create(Persion);
  // 增强新对象，添加 age 属性
  student.age = 0;
  return student;
}

// 创建 Student 的实例 stu
const stu = createStudent();

// stu.__proto__ === Persion
console.log(stu.name); // 输出 '人类'

```

### 寄生式组合继承

```javascript
function Persion(){
     this.name = '人类'
   }
   function Student(){
     Persion.call(this);
     this.age = 0
   }
   Student.prototype = Object.create(Persion.prototype)
   Student.prototype.constructor = Student; // 修正 Student.prototype.constructor 指向 Student
   const stu = new Student()
   stu.name = '学生'
   console.log(stu.name)
```
