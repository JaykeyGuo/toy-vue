// 响应式
function defineReactive(obj, key, val) {
  const dep = new Dep(); // 一个对象一个依赖收集器

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      dep.addSub(Dep.target); // 执行 依赖收集 TODO:放入Watcher对象
      return val;
    },
    set: function reactiveSetter(newValue) {
      if (newValue === val) return;
      dep.notify(); // 通知依赖更新
    }
  })
}

// 观察者
function observer(value) {
  if (!value || (typeof value !== 'object')) {
    return;
  }

  Object.keys(value).forEach((key) => {
    // 遍历所有的数据，对每一个数据做响应式处理
    defineReactive(value, key, value[key]);
  })
}

// 依赖收集
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    this.subs.forEach((sub) => {
      sub.update(); // 触发依赖更新事件
    })
  }
}

class Watcher {
  constructor() {
    Dep.target = this;
  }
  update() {
    console.log('View has updated');
  }
}
Dep.target = null; // 通过全局的依赖来实现Watcher的notify

// Vue 实例
class Vue {
  constructor(options) {
    this._data = options.data;
    observer(this._data); // 1.将所有的数据做响应式处理
    new Watcher(); // 2.新建一个Watcher
    console.log('render', this._data.test);
  }
}

// example
let o = new Vue({
  data: {
    test: 'I am test',
  }
});

o._data.test = 'hello world!';