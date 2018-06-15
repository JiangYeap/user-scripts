// Argument str is the CSS string to be injected.
function injectCSS(str) {
  let node = document.createElement('style');
  node.innerHTML = str;
  document.head.appendChild(node);
}
