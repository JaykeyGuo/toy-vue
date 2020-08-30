let callbacks = [];
let pending = false;

function nextTick(cb) {
  callbacks.push(cb);

  if (!pending) {
    pending = true;
    // 核心的异步处理在这里，在使用queueWather收集完所有的watch变动之后，
    // 通过异步的方式来执行对应的依赖。
    // 优先使用微任务 Promise => MutationObserver => setImmediate => setTimeout
    // 这是处理兼容性的问题
    setTimeout(flushCallbacks, 0);
  }
}

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

let uid = 0;

class Watcher {
  constructor() {
    this.id = ++uid;
  }

  update() {
    console.log('watch' + this.id + 'update');
    queueWatcher(this);
  }

  run() {
    console.log('watch' + this.id + 'view is updated');
  }
}

let has = {};
let queue = [];
let waiting = false;

// 👇使用的方式是通过时间换空间
// 先把所有的watcher都存起来，同时去重
function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher); // 收集这一轮触发的watcher

    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

function flushSchedulerQueue() {
  let watcher, id;
  for (let index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run(); // 收集完成之后，执行所有watcher的run方法，触发视图的更新
  }

  waiting = false;
}

// TEST CODE
let watch1 = new Watcher();
let watch2 = new Watcher();

watch1.update();
watch1.update();
watch2.update();