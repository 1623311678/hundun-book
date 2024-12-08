# 1 vue 生命周期

Vue.js 的生命周期钩子函数主要有以下几个：

1. **beforeCreate**: 实例初始化之后，数据观测和事件配置之前调用。
2. **created**: 实例创建完成后调用，此时数据观测和事件配置已经完成，但 DOM 还未生成。
3. **beforeMount**: 在挂载开始之前调用，相关的 render 函数首次被调用。
4. **mounted**: 实例挂载到 DOM 上后调用。
5. **beforeUpdate**: 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
6. **updated**: 由于数据更改导致的虚拟 DOM 重新渲染和打补丁之后调用。
7. **beforeDestroy**: 实例销毁之前调用，此时实例仍然完全可用。
8. **destroyed**: 实例销毁后调用，调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。

这些钩子函数可以让开发者在 Vue 实例的不同阶段执行特定的操作。

# 2 源码入口

```javascript
// src/core/instance/index.ts

import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import type { GlobalAPI } from 'types/global-api'

function Vue(options) {
  if (__DEV__ && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

//@ts-expect-error Vue has function type
initMixin(Vue)
//@ts-expect-error Vue has function type
stateMixin(Vue)
//@ts-expect-error Vue has function type
eventsMixin(Vue)
//@ts-expect-error Vue has function type
lifecycleMixin(Vue)
//@ts-expect-error Vue has function type
renderMixin(Vue)

export default Vue as unknown as GlobalAPI

```

主要包括 initMixin、stateMixin、eventsMixin、lifecycleMixin、renderMixin 5 个方法

## initMixin

```javaScript
    initLifecycle(vm) //初始化生命周期相关的属性和方法。
    initEvents(vm) //初始化事件系统
    initRender(vm) //初始化渲染函数
    callHook(vm, 'beforeCreate', undefined, false /* setContext */)
    initInjections(vm) // 初始化依赖注入，在数据和属性之前解析注入。
    initState(vm) //初始化状态，包括数据、属性、计算属性、方法和观察者。
    initProvide(vm) // 初始化提供的依赖，在数据和属性之后解析提供。
    callHook(vm, 'created')
```

initMixin 方法主要是对 Vue 实例进行初始化，包括生命周期、事件、渲染等操作。

因此我们常说最早在created阶段的时候，才可以获取到数据

## `stateMixin` 

主要做了以下几件事：

```javascript

  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (
    expOrFn: string | (() => any),
    cb: any,
    options?: Record<string, any>
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      const info = `callback for immediate watcher "${watcher.expression}"`
      pushTarget()
      invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
      popTarget()
    }
    return function unwatchFn() {
      watcher.teardown()
    }
  }

```

1. 定义了 `$data` 和 `$props` 的 getter 方法，并在开发环境中添加了 setter 方法的警告。

2. 使用 `Object.defineProperty` 将 `$data` 和 `$props` 属性添加到 Vue 实例的原型上。

3. 将 `$set` 和 `$delete` 方法添加到 Vue 实例的原型上，分别用于设置和删除响应式属性。

4. 将 `$watch` 方法添加到 Vue 实例的原型上，用于创建一个观察者来监听数据的变化，并在变化时执行回调函数。

## eventsMixin

是的，`eventsMixin` 实现了一个发布订阅模式。以下是它的主要功能：

1. **$on**: 注册事件监听器。
2. **$once**: 注册一次性事件监听器，触发一次后自动移除。
3. **$off**: 移除事件监听器。
4. **$emit**: 触发事件，调用所有注册的监听器。

这些方法允许组件之间进行事件通信，实现了发布订阅模式。

```javascript
export function eventsMixin(Vue: typeof Component) {
  const hookRE = /^hook:/
  Vue.prototype.$on = function (
    event: string | Array<string>,
    fn: Function
  ): Component {
    const vm: Component = this
    if (isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn)
      }
    } else {
      ;(vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }

  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on() {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }

  Vue.prototype.$off = function (
    event?: string | Array<string>,
    fn?: Function
  ): Component {
    const vm: Component = this
    // all
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    if (isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event!]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event!] = null
      return vm
    }
    // specific handler
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (__DEV__) {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
            `${formatComponentName(
              vm
            )} but the handler is registered for "${event}". ` +
            `Note that HTML attributes are case-insensitive and you cannot use ` +
            `v-on to listen to camelCase events when using in-DOM templates. ` +
            `You should probably use "${hyphenate(
              event
            )}" instead of "${event}".`
        )
      }
    }
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      const info = `event handler for "${event}"`
      for (let i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info)
      }
    }
    return vm
  }
}
```

## lifecycleMixin

```javascript

export function lifecycleMixin(Vue: typeof Component) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    let wrapper: Component | undefined = vm
    while (
      wrapper &&
      wrapper.$vnode &&
      wrapper.$parent &&
      wrapper.$vnode === wrapper.$parent._vnode
    ) {
      wrapper.$parent.$el = wrapper.$el
      wrapper = wrapper.$parent
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }

  Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }

  Vue.prototype.$destroy = function () {
    const vm: Component = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // teardown scope. this includes both the render watcher and other
    // watchers created
    vm._scope.stop()
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    vm._isDestroyed = true
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null)
    // fire destroyed hook
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null
    }
  }
}


```

这个代码定义了一个 `lifecycleMixin` 函数，用于向 Vue 的原型上添加生命周期相关的方法。具体来说，它添加了三个方法：`_update`、`$forceUpdate` 和 `$destroy`。

### `_update` 方法
- **功能**：更新组件的 DOM。
- **参数**：
  - `vnode`：新的虚拟节点。
  - `hydrating`：是否为服务端渲染。
- **实现**：
  1. 保存当前实例 `vm` 的 `prevEl` 和 `prevVnode`。
  2. 调用 `setActiveInstance` 设置当前活动实例，并保存恢复函数 `restoreActiveInstance`。
  3. 更新 `vm._vnode` 为新的 `vnode`。
  4. 根据是否有 `prevVnode` 判断是初次渲染还是更新：
     - 初次渲染：调用 `vm.__patch__` 进行初次渲染。
     - 更新：调用 `vm.__patch__` 进行更新。
  5. 恢复活动实例。
  6. 更新 `__vue__` 引用。
  7. 如果父组件是高阶组件（HOC），更新其 `$el`。

### `$forceUpdate` 方法
- **功能**：强制组件重新渲染。
- **实现**：
  1. 如果组件有 `_watcher`，调用其 `update` 方法。

### `$destroy` 方法
- **功能**：销毁组件实例。
- **实现**：
  1. 如果组件已经在销毁过程中，直接返回。
  2. 调用 `beforeDestroy` 钩子。
  3. 标记组件为正在销毁。
  4. 从父组件中移除自身。
  5. 停止所有作用域（包括渲染观察者和其他观察者）。
  6. 如果数据对象有观察者，减少其引用计数。
  7. 标记组件为已销毁。
  8. 调用 `__patch__` 销毁当前渲染树。
  9. 调用 `destroyed` 钩子。
  10. 关闭所有实例监听器。
  11. 移除 `__vue__` 引用。
  12. 释放循环引用。

这个 `lifecycleMixin` 函数通过向 Vue 的原型添加这些方法，扩展了 Vue 实例的生命周期管理功能。

## renderMixin

```javascript

export function renderMixin(Vue: typeof Component) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: (...args: any[]) => any) {
    return nextTick(fn, this)
  }

  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode && vm._isMounted) {
      vm.$scopedSlots = normalizeScopedSlots(
        vm.$parent!,
        _parentVnode.data!.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
      if (vm._slotsProxy) {
        syncSetupSlots(vm._slotsProxy, vm.$scopedSlots)
      }
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode!
    // render self
    const prevInst = currentInstance
    const prevRenderInst = currentRenderingInstance
    let vnode
    try {
      setCurrentInstance(vm)
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e: any) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (__DEV__ && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(
            vm._renderProxy,
            vm.$createElement,
            e
          )
        } catch (e: any) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = prevRenderInst
      setCurrentInstance(prevInst)
    }
    // if the returned array contains only a single node, allow it
    if (isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (__DEV__ && isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
}


```


### 主要功能
- **安装渲染辅助函数**：为 Vue 实例安装一些渲染时的辅助函数。
- **$nextTick**：在下次 DOM 更新循环结束之后执行延迟回调。
- **_render**：生成虚拟 DOM 节点（VNode），并处理渲染过程中的错误。

### 渲染过程
1. **处理作用域插槽**：如果有父级 VNode 且组件已挂载，处理作用域插槽。
2. **设置父级 VNode**：将当前 VNode 设置为父级 VNode。
3. **调用渲染函数**：调用组件的渲染函数生成 VNode。
4. **错误处理**：如果渲染过程中发生错误，调用 `renderError` 函数（如果存在）进行错误处理。
5. **返回 VNode**：返回生成的 VNode，如果渲染函数返回多个根节点或发生错误，返回一个空的 VNode。

通过 `renderMixin`，Vue 实例具备了渲染和更新视图的能力。

## nextTick原理

`nextTick` 是 Vue.js 中用于在下次 DOM 更新循环结束之后执行延迟回调的一个方法。其原理主要是利用了 JavaScript 的异步队列机制。以下是 `nextTick` 的实现原理：

### 实现原理

1. **异步队列**：`nextTick` 会将回调函数放入一个队列中，确保这些回调函数在下次 DOM 更新循环结束之后执行。

2. **优先使用微任务**：在现代浏览器中，微任务（如 `Promise`）的执行优先级高于宏任务（如 `setTimeout`）。因此，`nextTick` 优先使用微任务来实现异步回调。

3. **降级处理**：如果微任务不可用，则使用宏任务（如 `setTimeout`）来实现。

### 代码示例

以下是一个简化的 `nextTick` 实现示例：

```javascript

let callbacks = []
let pending = false

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let timerFunc

if (typeof Promise !== 'undefined') {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
} else if (typeof MutationObserver !== 'undefined') {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        console.error(e)
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

### 主要步骤

1. **定义回调队列**：`callbacks` 用于存储所有的回调函数。
2. **定义 `flushCallbacks` 函数**：用于执行并清空回调队列。
3. **选择异步方法**：优先使用 `Promise`，其次是 `MutationObserver`，最后是 `setTimeout`。
4. **实现 `nextTick` 函数**：将回调函数添加到队列中，并在合适的时机调用 `flushCallbacks` 执行回调。

通过这种方式，`nextTick` 能够确保在 DOM 更新完成之后执行回调函数，从而避免了同步执行带来的性能问题
