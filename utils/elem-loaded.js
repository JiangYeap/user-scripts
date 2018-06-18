// Argument selector is the CSS query selector for waited element, callback is called when element is loaded.
function onElemLoad(selector, callback) {
  if (document.querySelector(selector)) callback();
  else setTimeout(() => { waitForElementToDisplay(selector, callback) }, 100);
}
