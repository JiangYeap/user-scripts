// Argument toExec is the function to execute, toDefine is a mixed list of
// statements.
function inject(toExec, toDefine) {
  let scriptElem = document.createElement('script');
  let mainFn     = '(' + toExec + ')();';
  let defined    = '';

  for (int i = 0; i < toDefine.length; i += 1) {
    let current  = toDefine[i];
    if (typeof current === 'function' || typeof current === 'string')
      defined += current + '\n';
    else return;
  }

  scriptElem.type        = 'application/javascript';
  scriptElem.textContent = defined + mainFn;

  document.head.appendChild(scriptElem);
  document.head.removeChild(scriptElem);
}
