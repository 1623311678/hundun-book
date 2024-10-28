# 事件循环

[详解JavaScript单线程和Event Loop机制.](https://github.com/fyuanfen/note/blob/master/article/Server/%E8%AF%A6%E8%A7%A3JavaScript%E5%8D%95%E7%BA%BF%E7%A8%8B%E5%92%8CEvent%20Loop%E6%9C%BA%E5%88%B6.md)
## 浏览器
### 例子1
```javascript
  <script>
      console.log("start");
      setTimeout(() => {
        console.log("timeout1");
        setTimeout(() => {
          console.log("timeout2");
        }, 0);
        Promise.resolve().then(() => {
          console.log("promise1");
          Promise.resolve().then(() => {
            console.log("nested promise1");
          });
        });
      }, 0);
      Promise.resolve()
        .then(() => {
          console.log("promise2");
          setTimeout(() => {
            console.log("timeout3");
          }, 0);
        })
        .then(() => {
          console.log("promise3");
        });
      console.log("end");
      // start 、end、promise2、promise3、timeout1、promise1、nested promise1、timeout3、timeout2
    </script>
```
### 例子2

```javascript
  <script>
      console.log("start");
      setTimeout(() => {
        console.log("timeout1");
        Promise.resolve().then(() => {
          console.log("promise1");
        });
      }, 0);
      Promise.resolve()
        .then(() => {
          console.log("promise2");
          setTimeout(() => {
            console.log("timeout2");
          }, 0);
        })
        .then(() => {
          console.log("promise3");
        });
      console.log("end");
      // start、end 、promise2、promise3、timeout1、promise1、timeout2
    </script>
```

### 例子3

```javascript

 <script>
      async function async1() {
        console.log("async1 start");
        await async2();
        console.log("async1 end");
      }
      async function async2() {
        console.log("async2 start");
        await async3();
        console.log("async2 end");
      }
      async function async3() {
        console.log("async3");
      }
      console.log("script start");
      setTimeout(() => {
        console.log("setTimeout");
      }, 0);
      async1();
      new Promise((resolve) => {
        console.log("promise1");
        resolve();
      })
        .then(() => {
          console.log("promise2");
        })
        .then(() => {
          console.log("promise3");
        });

      console.log("script end");
      // script start、async1 start、async2 start、async3、promise1、script end、async2 end、promise2、async1 end、promise3、setTimeout
    </script>
```
### 例子4 

```javascript
 <script>
      console.log("start");
      setTimeout(() => {
        console.log("timeout1");
      }, 0);
      setTimeout(() => {
        console.log("timeout2");
        Promise.resolve().then(() => {
          console.log("promise1");
        });
      }, 0);
      Promise.resolve()
        .then(() => {
          console.log("promise2");
        })
        .then(() => {
          console.log("promise3");
        });
      console.log("end");
      // start、end、promise2、promise3、timeout1、timeout2、promise1
    </script>
```
### 例子5

```javascript
  <script>
      console.log("script start");
      setTimeout(() => {
        console.log("setTimeout1");
        Promise.resolve().then(() => {
          console.log("promise1");
        });
      }, 0);
      async function async1() {
        console.log("async1 start");
        await async2();
        console.log("async1 end");
      }
      async function async2() {
        console.log("async2 start");
        await Promise.resolve().then(() => {
          console.log("async2 promise");
        });
        console.log("async2 end");
      }
      async1();
      new Promise((resolve) => {
        console.log("promise2");
        resolve();
      }).then(() => {
        console.log("promise3");
      });
      setTimeout(() => {
        console.log("setTimeout2");
      }, 0);
      console.log("script end");
      // script start 、async1 start、async2 start、promise2、script end、async2 promise、promise3、async2 end、async1 end、setTimeout1、promise1、setTimeout2
      // 
    </script>
```
## Node.js

### 例子1

```javascript
const fs = require('fs');

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

fs.readFile(__filename, () => {
  console.log('readFile');
});

setImmediate(() => {
  console.log('setImmediate');
});

Promise.resolve().then(() => {
  console.log('promise1');
}).then(() => {
  console.log('promise2');
});

console.log('script end');
// script start、script end、promise1、promise2、setTimeout、setImmediate、readFile
```
### 例子2 

```javascript
const fs = require('fs');

console.log('script start');

setTimeout(() => {
  console.log('setTimeout1');
}, 0);

setTimeout(() => {
  console.log('setTimeout2');
}, 0);
console.log('script start');
fs.readFile(__filename, () => {
  console.log('readFile');
  setTimeout(() => {
    console.log('setTimeout3');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate1');
  });
});

setImmediate(() => {
  console.log('setImmediate2');
});

Promise.resolve().then(() => {
  console.log('promise1');
}).then(() => {
  console.log('promise2');
});

console.log('script end');
// script start、script end、promise1、promise2、setTimeout1、setTimeout2、setImmediate2、readFile、setTimeout3、setImmediate1
```