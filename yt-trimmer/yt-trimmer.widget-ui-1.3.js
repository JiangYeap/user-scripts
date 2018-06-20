const CSS_OLD = //
  `
    #trim-widget {
      float: right;
      visibility: hidden;
      width: auto;
      height: 23px;
      line-height: 23px;
      margin-top: -27px;
    }

    #trim-status {
      width: 1em;
      height: 1em;
    }

    #trim-box {
        opacity: 0;
        transition: opacity 400ms ease-in-out;
        position: absolute;
        top: 55px;
        margin-left: 12px;
        padding: 1em;
        width: 100%;
        height: auto;
        max-width: 223px;
        background: rgba(42, 45, 50, 0.85);
        line-height: 1.4;
        font-size: 90%;
        text-align: center;
        color: #ffffff;
    }

    #trim-box > i {
        font-size: 1em;
        line-height: normal;
        vertical-align:middle;
    }
  `;

const CSS_NEW = //
  `
    #trim-widget {
        float: right;
        visibility: hidden;
        width: auto;
        height: 23px;
        line-height: 23px;
        margin-top: 5px;
        margin-left: 5em;
    }

    #trim-widget > * {
        font-size: 1.5em;
    }

    #trim-status {
        width: 1.1em;
        height: 1.1em;
    }

    #trim-form {
        margin-top: 2px
    }
  `;

let CSS_STR = //
  `
    #trim-widget > * {
        line-height: normal;
        vertical-align: middle;
    }

    #trim-status {
        display: inline-block;
        background: #888888;
        border-radius: 50%;
    }

    #trim-form {
        display: inline-block;
        width: auto;
        height: 100%;
    }

    .trim-label {
      margin-left: 0.9em;
    }

    .trim-input {
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      outline: none;
      padding: 0px;
      border: none;
      border-bottom: 1px solid #ddd;
      background: transparent;
      text-align: center;
      height: 100%;
      width: 3em;
    }

    .trim-input:not(:focus):invalid {
      box-shadow: none;
    }

    .trim-button {
        margin-left: 0.9em;
        background: #2980b9;
        padding: 4px 12px 4px 12px;
        border: none;
        color: #fff;
    }

    .trim-button:hover {
        background: #2c3e50;
        box-shadow:none;
        -moz-box-shadow:none;
        -webkit-box-shadow:none;
    }

    .show-status {
        opacity: 1 !important;
    }

    .show-notification {
        opacity: 1 !important;
    }

    ::-webkit-input-placeholder {
        font-style: italic;
    }

    :-moz-placeholder {
        font-style: italic;
    }

    ::-moz-placeholder {
        font-style: italic;
    }

    :-ms-input-placeholder {
        font-style: italic;
    }
  `;

// Function which initialises UI for application.
function setWidgetUi() {
  let trimElem  = document.createElement('span');
  let container = document.getElementById('yt-masthead-content');

  if (!container) {
    container = document.getElementsByTagName('ytd-searchbox')[0];
    CSS_STR += CSS_NEW;
  }
  else CSS_STR += CSS_OLD;

  trimElem.id        = 'trim-widget';
  trimElem.innerHTML = //
    `
      <a id="trim-status" class="tooltip-bottom"></a>
      <form id="trim-form">
          <label for="trim-start" class="trim-label">Start: </label>
          <input id="trim-start" class="trim-input" type="text" autocomplete="off" required="required" />
          <label for="trim-end" class="trim-label">End: </label>
          <input id="trim-end" class="trim-input" type="text" autocomplete="off" required="required" />
          <button type="submit" class="trim-button">Confirm</button>
      </form>
      <div id="trim-box"></div>
    `
  container.append(trimElem);
}

// Function which initialises hover listener for trim-status.
function initStatusListener() {
  let statusElem = document.querySelector('#trim-status');
  let boxElem    = document.querySelector('#trim-box');

  statusElem.onmouseover = () => {
    let vidId   = getUrlParameter('v');
    let boxHtml = 'Oops, something went wrong!';

    if (DICT[vidId]) boxHtml = '<i class="material-icons">info</i>&emsp;Video is trimmed. Set start and end to -1 to delete entry.';
    else boxHtml = '<i class="material-icons">info</i>&emsp;Video is not trimmed. Set start and end time to trim.';

    boxElem.style.background = 'rgba(42, 45, 50, 0.85)';
    boxElem.innerHTML        = boxHtml
    boxElem.classList.add('show-status');
  };
  statusElem.onmouseout  = () => { boxElem.classList.remove('show-status') };
}

// Function which refreshes the UI on intervals based on current video.
function updateWidgetUi() {
  setInterval(uiStep, 250);

  function uiStep() {
    let vidId      = getUrlParameter('v');
    let inputStart = document.querySelector('#trim-start');
    let inputEnd   = document.querySelector('#trim-end');
    let trimElem   = document.querySelector('#trim-widget');
    let trimStatus = document.querySelector('#trim-status');
    let container  = document.querySelector('#yt-masthead-content');
    let searchBar  = document.querySelector('#masthead-search');

    if (!vidId) trimElem.style.visibility = 'hidden';
    else {
      if (container && searchBar && container.offsetWidth - searchBar.offsetWidth < trimElem.offsetWidth) trimElem.style.visibility = 'hidden';
      else trimElem.style.visibility = 'visible';

      if (DICT[vidId]) {
        inputStart.placeholder      = secToTime(DICT[vidId][0]);
        inputEnd.placeholder        = secToTime(DICT[vidId][1]);
        trimStatus.style.background = '#2ecc71';
      }
      else {
        inputStart.placeholder      = 'mm:ss';
        inputEnd.placeholder        = 'mm:ss';
        trimStatus.style.background = '#888888';
      }
    }
  }
}
