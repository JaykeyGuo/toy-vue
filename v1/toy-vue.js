export class ToyVue {
  constructor(config) {
    this.template = document.querySelector(config.el);
    this.data = reactive(config.data);
    for (let name in config.methods) {
      this[name] = () => {
        config.methods[name].apply(this.data);
      }
    }
    this.traversal(this.template);
  }
  //
  traversal(node) {
    // {{ message }}
    if (node.nodeType === Node.TEXT_NODE) { //Node.TEXT_NODE
      if (node.textContent.trim().match(/^{{([\s\S/]+)}}$/)) {
        let name = RegExp.$1.trim();
        effect(() => node.textContent = this.data[name]);
      }
    }

    if (node.nodeType === Node.ELEMENT_NODE) { //Node.TEXT_NODE
      let attributes = node.attributes;
      for (let attribute of attributes) {
        // v-model
        if (attribute.name === 'v-model') {
          let name = attribute.value;
          effect(() => node.value = this.data[name]);
          node.addEventListener('input', event => this.data[name] = node.value);
        }

        // v-bind
        if (attribute.name.match(/^v\-bind:([\s\S]+)$/)) {
          let attrbuteName = RegExp.$1;
          let name = attribute.value
          effect(() => node.setAttribute(attrbuteName, this.data[name]));
        }

        // v-on
        if (attribute.name.match(/^v\-on:([\s\S]+)$/)) {
          let eventName = RegExp.$1;
          let fnName = attribute.value
          node.addEventListener(eventName, this[fnName]);
        }
      }
    }
    if (node.childNodes && node.childNodes.length) {
      for (let child of node.childNodes) {
        this.traversal(child);
      }
    }
  }
}

let effects = new Map();

let currentEffect = null;

function effect(fn) {
  currentEffect = fn;
  fn();
  currentEffect = null;
}

function reactive(object) {
  let observed = new Proxy(object, {
    // 在 getter 中做依赖收集
    get(object, property) {
      if (currentEffect) {
        if (!effects.has(object)) {
          effects.set(object, new Map());
        }
        if (!effects.get(object).has(property)) {
          effects.get(object).set(property, new Array);
        }
        effects.get(object).get(property).push(currentEffect);
      }

      return object[property];
    },
    set(object, property, value) {
      object[property] = value;

      if (effects.has(object) && effects.get(object).has(property)) {
        for (let effect of effects.get(object).get(property)) {
          effect();
        };
      }


      return true;
    }
  })

  return observed;
}


// Test case Start
// let dummy;
// const counter = reactive({num: 0});
// effect(() => (dummy = counter.num));

// console.log(dummy);
// counter.num = 7;
// console.log(dummy);


// let dummy2;
// const counter2 = reactive({num22: 0});
// effect(() => (dummy2 = counter2.num22));

// console.log(dummy2);
// counter2.num22 = 990;
// console.log(dummy2);
// Test case End