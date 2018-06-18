// Argument str is the CSS string to be injected.
function injectCss(str) {
  let styleElem = document.createElement('style');
  styleElem.innerHTML = str;
  document.head.appendChild(styleElem);
}

// Argument attrs is a list of [<Attribute>, <Value>] to be added to style tag.
function injectCssSrc(src, attrs) {
  let styleElem  = document.createElement('link');
  styleElem.rel  = 'stylesheet';
  styleElem.type = 'text/css'
  styleElem.href = src;

  for (let i = 0; i < attrs.length; i += 1) {
    let attr = attrs[i];
    styleElem.setAttribute(attr[0], attr[1]);
  }

  document.head.appendChild(styleElem);
}
