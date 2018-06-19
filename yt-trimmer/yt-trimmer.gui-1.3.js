const CSS_OLD = //
  `
    #trim-box {
        float: right;
        visibility: hidden;
        width: auto;
        height: 23px;
        line-height: 23px;
        margin-top: -27px;
    }

    #trim-box > * {
        line-height: normal;
        vertical-align: middle;
    }

    #trim-status {
        display: inline-block;
        background: #888888;
        width: 1em;
        height: 1em;
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
  `

const CSS_NEW = //
  `
    #trim-box {
        float: right;
        visibility: hidden;
        width: auto;
        height: 23px;
        line-height: 23px;
        margin-top: 5px;
        margin-left: 5em;
    }

    #trim-box > * {
        line-height: normal;
        vertical-align: middle;
        font-size: 1.5em;
    }

    #trim-status {
        display: inline-block;
        background: #888888;
        width: 1.1em;
        height: 1.1em;
        border-radius: 50%;
    }

    #trim-form {
        display: inline-block;
        width: auto;
        height: 100%;
        margin-top: 2px
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
  `

let CSS_STR = '';

// Function which initialises UI for application.
function setUi() {
  let trimElem  = document.createElement('span');
  let container = document.getElementById('yt-masthead-content');

  if (!container) {
    container = document.getElementsByTagName('ytd-searchbox')[0];
    CSS_STR += CSS_NEW;
  }
  else CSS_STR += CSS_OLD;

  trimElem.id        = 'trim-box';
  trimElem.innerHTML = //
    `
      <span id="trim-status"></span>
      <form id="trim-form">
          <label for="trim-start" class="trim-label">Start: </label>
          <input id="trim-start" class="trim-input" type="text" autocomplete="off" required="required" />
          <label for="trim-end" class="trim-label">End: </label>
          <input id="trim-end" class="trim-input" type="text" autocomplete="off" required="required" />
          <button type="submit" class="trim-button">Confirm</button>
      </form>
    `

  container.append(trimElem);
}

// Function which refreshes the UI on intervals based on current video.
function updateUi() {
  function uiStep() {
    let vidId      = getUrlParameter('v');
    let inputStart = document.querySelector('#trim-start');
    let inputEnd   = document.querySelector('#trim-end');
    let trimElem   = document.querySelector('#trim-box');
    let trimStatus = document.querySelector('#trim-status');

    if (!vidId)
    trimElem.style.visibility = 'hidden';
    else {
      trimElem.style.visibility = 'visible';

      if (DICT[vidId]) {
        inputStart.placeholder      = secToTime(DICT[vidId][0]);
        inputEnd.placeholder        = secToTime(DICT[vidId][1]);
        trimStatus.style.background = '#2ecc71';
        trimStatus.title            = 'Video is trimmed. Set start and end to -1 to delete entry.';
      }
      else {
        inputStart.placeholder      = 'mm:ss';
        inputEnd.placeholder        = 'mm:ss';
        trimStatus.style.background = '#888888';
        trimStatus.title            = 'Video is not trimmed. Set start and end time to trim.';
      }
    }
  }

  setInterval(uiStep, 250);
}
