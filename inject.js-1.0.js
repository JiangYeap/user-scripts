// Codes to indicate function declaration or execution. STR is ignored.
const FN_DEF  = 0;
const FN_EXEC = 1;
const STR     = -1;

// Argument stmts contain a list of (<Statement>, <Code>), which will be
// declared/executed in that order.
function injectJS(stmts) {
  let scriptElem = document.createElement('script');
  let scriptText = '';

  for (let i = 0; i < stmts.length; i += 1) {
    let stmt  = stmts[i];

    if (typeof stmt[0] === 'string') scriptText += stmt[0];
    else if (typeof stmt[0] === 'function' && stmt[1] === FN_DEF) scriptText += stmt[0];
    else if (typeof stmt[0] === 'function' && stmt[1] === FN_EXEC) scriptText += '(' + stmt[0] + ')' + '();';
    else throw 'Invalid script: ' + stmt[0];

    scriptText += '\n';
  }

  scriptElem.type        = 'application/javascript';
  scriptElem.textContent = scriptText;

  document.head.appendChild(scriptElem);
  document.head.removeChild(scriptElem);
}
