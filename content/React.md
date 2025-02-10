## React

### 1 从编写react的代码的角度来看，如何提高react应用的性能

### React 19里的新东西

https://zh-hans.react.dev/blog/2024/12/05/react-19#whats-new-in-react-19

乐观更新，useActionState,可以像html那样写入链接，script link preload prefetch等。

https://www.imooc.com/article/375194


## React

### 1 从编写react的代码的角度来看，如何提高react应用的性能

1. 使用 React.memo  
React.memo 是一个高阶组件，用于防止不必要的重新渲染。它通过浅比较来检查 props 是否改变，如果没有改变，则跳过重新渲染。
```javascript
import React from 'react';

const MyComponent = React.memo((props) => {
  // 组件逻辑
  return <div>{props.value}</div>;
});
```

2. 使用 useMemo 和 useCallback  
- `useMemo` 用于缓存计算结果，避免每次渲染都重新计算。
- `useCallback` 用于缓存函数引用，避免子组件不必要的重新渲染。
```javascript
import React, { useMemo, useCallback } from 'react';

const MyComponent = ({ items, onClick }) => {
  const computedValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  const handleClick = useCallback(() => {
    onClick(computedValue);
  }, [onClick, computedValue]);

  return <button onClick={handleClick}>Click Me</button>;
};
```

3. 避免匿名函数和内联对象  
在 JSX 中避免使用匿名函数和内联对象，因为它们会导致每次渲染时创建新的引用。

4. 使用代码分割和懒加载  
通过 `React.lazy` 和 `Suspense` 实现组件的按需加载，减少初始加载时间。
```javascript
import React, { Suspense } from 'react';

const LazyComponent = React.lazy(() => import('./LazyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

5. 使用生产模式  
确保在生产环境中运行 React 应用，因为开发模式会有额外的检查和警告，影响性能。

6. 避免不必要的状态更新  
通过优化状态管理，减少不必要的状态更新。例如，使用 `useReducer` 或者将状态提升到更高的组件层级。

7. 使用虚拟化技术  
对于长列表，使用如 `react-window` 或 `react-virtualized` 等库来优化渲染性能。

8. 使用性能分析工具  
利用 React 开发者工具中的 Profiler 分析性能瓶颈，并进行针对性优化。
```

```markdown:content/ReactPerformance.md
## React 性能优化（代码层面）

### 1. CSS 优化
1. **CSS 模块化**  
   使用 CSS Modules 或 styled-components，避免全局样式污染，减少样式冲突。
   ```javascript
   import styles from './MyComponent.module.css';

   const MyComponent = () => <div className={styles.container}>Hello</div>;
   ```

2. **避免不必要的样式重绘**  
   - 减少使用复杂的 CSS 选择器（如后代选择器 `div div`）。
   - 避免使用 `*` 通配符选择器。

3. **CSS 动画优化**  
   - 使用 `transform` 和 `opacity` 代替 `top`、`left` 等属性，利用 GPU 加速。
   - 避免使用 `@keyframes` 动画过多，尽量使用 CSS 动画库（如 `framer-motion`）。

4. **按需加载 CSS**  
   使用动态导入，按需加载组件对应的样式。
   ```javascript
   import('./MyComponent.css').then(() => {
     // 样式加载完成
   });
   ```

---

### 2. JavaScript 优化
1. **减少不必要的依赖**  
   - 避免引入未使用的库或函数。
   - 使用 Tree Shaking 和 Webpack 的 `sideEffects` 配置移除无用代码。

2. **避免过多的状态管理**  
   - 将状态提升到合适的层级，避免重复管理。
   - 使用 `useReducer` 或 `Context` 替代过多的 `useState`。

3. **事件绑定优化**  
   - 避免在 JSX 中直接绑定事件，使用 `useCallback` 缓存事件处理函数。
   ```javascript
   const handleClick = useCallback(() => {
     console.log('Clicked');
   }, []);
   ```

4. **减少 DOM 操作**  
   - 使用 React 的 `ref` 直接操作 DOM，避免频繁的查询。
   - 合理使用 `shouldComponentUpdate` 或 `React.PureComponent`。

5. **代码分割**  
   - 使用动态导入和懒加载，减少初始加载体积。
   ```javascript
   const LazyComponent = React.lazy(() => import('./LazyComponent'));
   ```

6. **避免内存泄漏**  
   - 在组件卸载时清理定时器、事件监听器等。
   ```javascript
   useEffect(() => {
     const timer = setInterval(() => console.log('Running'), 1000);
     return () => clearInterval(timer);
   }, []);
   ```

---

### 3. HTML 优化
1. **减少 DOM 层级**  
   - 避免嵌套过深的 HTML 结构，减少浏览器的渲染开销。

2. **使用语义化标签**  
   - 使用 `<header>`、`<main>`、`<footer>` 等语义化标签，提升可读性和 SEO 性能。

3. **图片优化**  
   - 使用现代图片格式（如 WebP）。
   - 使用 `srcset` 提供多分辨率图片。
   ```html
   <img src="image.jpg" srcset="image-2x.jpg 2x, image-3x.jpg 3x" alt="example" />
   ```

4. **懒加载图片和资源**  
   - 使用 `loading="lazy"` 属性。
   ```html
   <img src="image.jpg" loading="lazy" alt="example" />
   ```

5. **减少 HTML 大小**  
   - 删除无用的注释和空白。
   - 使用压缩工具（如 HTMLMinifier）。

---

### 4. 其他综合优化
1. **使用 Service Worker**  
   - 利用 PWA 缓存静态资源，减少网络请求。

2. **使用 CDN**  
   - 将静态资源托管到 CDN，提升加载速度。

3. **启用 HTTP/2**  
   - 利用多路复用技术，提升资源加载效率。

4. **预加载关键资源**  
   - 使用 `<link rel="preload">` 提前加载关键资源。
   ```html
   <link rel="preload" href="styles.css" as="style">
   ```

5. **减少第三方脚本**  
   - 避免加载过多的第三方库，使用轻量级替代方案。

通过以上方法，从 CSS、JS、HTML 等多方面优化 React 应用的性能。

