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
  `;

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
  `;

let CSS_STR = //
  `
    [data-tooltip] {
        position: relative;
        cursor: pointer;
    }

    [data-tooltip]:before,
    [data-tooltip]:after {
        position: absolute;
        visibility: hidden;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
        filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
        opacity: 0;
        -webkit-transition:
            opacity 0.2s ease-in-out,
            visibility 0.2s ease-in-out,
            -webkit-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
        -moz-transition:
            opacity 0.2s ease-in-out,
            visibility 0.2s ease-in-out,
            -moz-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
        transition:
            opacity 0.2s ease-in-out,
            visibility 0.2s ease-in-out,
            transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform:    translate3d(0, 0, 0);
        transform:         translate3d(0, 0, 0);
        pointer-events: none;
    }

    [data-tooltip]:before {
        z-index: 1001;
        border: 6px solid transparent;
        background: transparent;
        content: "";
    }

    [data-tooltip]:after {
        z-index: 1000;
        padding: 8px;
        width: 160px;
        background-color: #000;
        background-color: hsla(0, 0%, 20%, 0.9);
        color: #fff;
        content: attr(data-tooltip);
        font-size: 14px;
        line-height: 1.2;
    }

    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after,
    [data-tooltip]:focus:before,
    [data-tooltip]:focus:after {
        visibility: visible;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
        filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
        opacity: 1;
    }

    .tooltip-bottom:before,
    .tooltip-bottom:after {
        top: 100%;
        bottom: auto;
        left: 50%;
    }

    .tooltip-bottom:before {
        margin-top: -12px;
        margin-bottom: 0;
        border-top-color: transparent;
        border-bottom-color: #000;
        border-bottom-color: hsla(0, 0%, 20%, 0.9);
    }

    .tooltip-bottom:hover:before,
    .tooltip-bottom:hover:after,
    .tooltip-bottom:focus:before,
    .tooltip-bottom:focus:after {
        -webkit-transform: translateY(12px);
        -moz-transform:    translateY(12px);
        transform:         translateY(12px);
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

  trimElem.id        = 'trim-box';
  trimElem.innerHTML = //
    `
      <span id="trim-status" class="tooltip-bottom"></span>
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
function updateWidgetUi() {
  function uiStep() {
    let vidId      = getUrlParameter('v');
    let inputStart = document.querySelector('#trim-start');
    let inputEnd   = document.querySelector('#trim-end');
    let trimElem   = document.querySelector('#trim-box');
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
        trimStatus.setAttribute('data-tooltip', 'Video is trimmed. Set start and end to -1 to delete entry.');
      }
      else {
        inputStart.placeholder      = 'mm:ss';
        inputEnd.placeholder        = 'mm:ss';
        trimStatus.style.background = '#888888';
        trimStatus.setAttribute('data-tooltip', 'Video is not trimmed. Set start and end time to trim.');
      }
    }
  }

  setInterval(uiStep, 250);
}
