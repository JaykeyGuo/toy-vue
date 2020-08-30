/* eslint-disable no-unused-vars */
class VNode {
  constructor(tag, data, children, text, ele) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.ele = ele;
  }
}

// const template = `
// <template>
//   <span class="demo" v-show="isShow">
//     This is a span
//   </span>
// </template>
// `;
// Use VNode to render template
// function render() {
//   return new VNode(
//     'span',
//     {
//       directives: [
//         {
//           rawName: 'v-show',
//           expression: 'isShow',
//           name: 'show',
//           value: true,
//         },
//       ],
//       staticCalss: 'demo',
//     },
//     [ new VNode(undefined, undefined, undefined, 'This is a span') ]
//   );
// }

function createEmptyVNode() {
  const node = new VNode();
  node.text = '';
  return node;
}

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
}

function cloneVNode(node) {
  const cloneVnode = new VNode(
    node.tag,
    node.data,
    node.children,
    node.text,
    node.ele,
  );
  return cloneVnode;
}
