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
        top: 55px;
        margin-left: 12px;
        max-width: 223px;
        font-size: 90%;
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

    #trim-box {
        top: 70px;
        margin-left: 18px;
        max-width: 253px;
        font-size: 1.3em;
        font-style: italic;
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

    #trim-box {
        pointer-events: none;
        opacity: 0;
        transition: opacity 400ms ease-in-out;
        position: absolute;
        padding: 1em;
        width: 100%;
        height: auto;
        background: rgba(42, 45, 50, 0.85);
        line-height: 1.4;
        text-align: center;
        color: #ffffff;
    }

    #trim-box > i {
        font-size: 100%;
        line-height: normal;
        vertical-align:middle;
    }

    .trim-label {
        margin-left: 0.9em;
    }

    .trim-input {
        box-sizing: border-box;
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

    #trim-button {
        cursor: pointer;
        margin-left: 0.9em;
        background: #2980b9;
        padding: 4px 12px 4px 12px;
        border: none;
        color: #fff;
    }

    #trim-button:hover {
        background: #2c3e50;
        box-shadow:none;
    }

    .show-status {
        pointer-events: auto !important;
        opacity: 1 !important;
    }

    .show-notification {
        pointer-events: auto !important;
        opacity: 1 !important;
    }

    ::-webkit-input-placeholder {
        font-style: italic;
    }

    :-ms-input-placeholder {
        font-style: italic;
    }

    ::placeholder {
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
      <span id="trim-status" class="tooltip-bottom"></span>
      <form id="trim-form">
          <label for="trim-start" class="trim-label">Start: </label>
          <input id="trim-start" class="trim-input" type="text" style="color: var(--yt-searchbox-text-color)" autocomplete="off" required="required" />
          <label for="trim-end" class="trim-label">End: </label>
          <input id="trim-end" class="trim-input" type="text" style="color: var(--yt-searchbox-text-color)" autocomplete="off" required="required" />
          <button id="trim-button" type="submit">Confirm</button>
      </form>
      <div id="trim-box"></div>
    `
  container.append(trimElem);
}

// Function which refreshes the UI on intervals based on current video.
function updateWidgetUi() {
  setInterval(widgetStep, 125);

  function widgetStep() {
    let player = document.querySelector('#movie_player');
    let vidId  = null;
    if (player) vidId = player.getVideoData()['video_id'];

    let inputStart = document.querySelector('#trim-start');
    let inputEnd   = document.querySelector('#trim-end');
    let trimElem   = document.querySelector('#trim-widget');
    let statusElem = document.querySelector('#trim-status');
    let container  = document.querySelector('#yt-masthead-content');
    let searchBar  = document.querySelector('#masthead-search');

    if (!vidId || !player.getDuration()) trimElem.style.visibility = 'hidden';
    else {
      if (container && searchBar && container.offsetWidth - searchBar.offsetWidth < trimElem.offsetWidth) trimElem.style.visibility = 'hidden';
      else trimElem.style.visibility = 'visible';

      if (DICT[vidId]) {
        inputStart.placeholder      = secToTime(DICT[vidId][0]);
        inputEnd.placeholder        = secToTime(DICT[vidId][1]);
        statusElem.style.background = '#2ecc71';
      }
      else {
        inputStart.placeholder      = 'mm:ss';
        inputEnd.placeholder        = 'mm:ss';
        statusElem.style.background = '#888888';
      }
    }
  }
}
