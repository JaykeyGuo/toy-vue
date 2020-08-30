# 学习Vue源码

第二版的源码学习，材料来自掘金小册《[剖析 Vue.js 内部运行机制](https://juejin.im/book/6844733705089449991/section)》，小册里面拆解的比较好，阅读起来没有太多的障碍。但是中间的AST的部分，由于解析HTML部分代码的工作量还是比较大的，即使笔者已经省去很多，但是还是挺冗余的，这部分可以先行学习如何解析HTML再看具体的代码。

render的部分也挺有意思的，核心的部分是如何对比两个VNode，来实现VNode的更新。

## nextTick部分
源码：https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js#L90

在nextTick中，就是统一收集update的事件，在响应式中通过setter来触发更新，在Watcher中，通过一个事件队列来收集本次需要更新的事件，最后通过一个异步的方式（微任务或者宏任务）来完成整个事件队列的执行。这里细想一下，其实和浏览器中的调用栈的原理是很类似的，只不过浏览器是用任务队列来完成的。在Vue中也是一个异步操作来完成的。

> Vue的nextTick，个人理解成一个小型的浏览器任务队列。

## Vuex的部分

在文中知道为什么可以在Vue的实例上访问到对应的Vuex的state了，其实是在Vue里面挂在了对应的store，也就是将Vuex的state放到了Vue下面。

