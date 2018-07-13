// ==UserScript==
// @name           YouTube Trimmer
// @version        1.4
// @include        https://www.youtube.com/*
// @description    Starts YouTube video at start mark and skips to end of video when current time exceeds end mark.
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/738b2607/utils/inject-script.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/738b2607/utils/inject-style.js
// @grant          none
// @run-at         document-start
// @author         Jiang Yeap
// ==/UserScript==

function trim() {
  let DICT     = JSON.parse(localStorage.getItem("dict")) || {};
  let barBg    = 'linear-gradient(to right, transparent {0}%, rgba(129, 236, 236, 0.40) {0}%, rgba(129, 236, 236, 0.40) {1}%, transparent {1}%)';
  let playedBg = 'linear-gradient(to right, rgba(255, 0, 0, 0.25) {0}%, #d63031 {0}%, #d63031 {1}%, rgba(255, 0, 0, 0.25) {1}%)';
  let loadedBg = 'linear-gradient(to right, transparent {0}%, rgba(188, 188, 188, 0.88) {0}%, rgba(188, 188, 188, 0.88) {1}%, transparent {1}%)';

  setInterval(trimStep, 125);
  setInterval(playerStep, 125);

  onElemLoad('#yt-masthead-content, ytd-searchbox.style-scope', initWidget);

  // Function which handles the trim logic.
  function trimStep() {
    let player = document.querySelector('#movie_player');
    let vidId  = null;
    if (player) vidId = player.getVideoData()['video_id'];

    if (DICT[vidId] && player.getDuration()) {
      let currentTime = player.getCurrentTime();
      let startTime   = DICT[vidId][0];
      let endTime     = DICT[vidId][1];

      if (Math.floor(currentTime) < startTime) player.seekTo(startTime);
      if (Math.floor(currentTime) >= endTime) player.seekTo(player.getDuration());
    }
  }

  // Function which handles the player Ui.
  function playerStep() {
    let player    = document.querySelector('#movie_player');
    let vidBar    = document.querySelector('.ytp-progress-list');
    let vidPlayed = document.querySelector('.ytp-play-progress');
    let vidLoaded = document.querySelector('.ytp-load-progress');
    let vidId     = null;

    if (player) vidId = player.getVideoData()['video_id'];

    if (DICT[vidId] && player.getAdState() !== 1) {
      let vidLength   = player.getDuration();
      let currentTime = player.getCurrentTime();
      let loadedTime  = player.getVideoLoadedFraction() * vidLength;
      let startTime   = DICT[vidId][0];
      let endTime     = DICT[vidId][1];

      let barStart    = (startTime + 0.33) / vidLength * 100;
      let barEnd      = (endTime - 0.33) / vidLength * 100;
      let playedStart = startTime / currentTime * 100;
      let playedEnd   = 100;
      let loadedStart = startTime / loadedTime * 100;
      let loadedEnd   = 100;

      if (currentTime >= endTime) playedEnd = endTime / currentTime * 100;
      if (loadedTime >= endTime) loadedEnd = endTime / loadedTime * 100;

      vidBar.style.background    = barBg.format(barStart, barEnd);
      vidPlayed.style.background = playedBg.format(playedStart, playedEnd);
      vidLoaded.style.background = loadedBg.format(loadedStart, loadedEnd);
    }
    else if (player) hidePlayerUi();

    function hidePlayerUi() {
      vidBar.style.background    = '';
      vidPlayed.style.background = '';
      vidLoaded.style.background = '';
    }
  }

  // Listener for an element to load.
  function onElemLoad(selector, callback) {
    if (document.querySelector(selector)) callback();
    else setTimeout(() => { onElemLoad(selector, callback) }, 100);
  }

  // Function which initialises the widget Ui.
  function initWidget() {
    const CSS_OLD = //
      `
        #trim-widget {
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

    let trimElem  = document.createElement('span');
    let container = document.getElementById('yt-masthead-content');
    let styleElem = document.createElement('style');
    let addCss    = CSS_OLD;

    if (!container) {
      container = document.getElementsByTagName('ytd-searchbox')[0];
      addCss = CSS_NEW;
    }

    styleElem.innerHTML = addCss;
    document.head.appendChild(styleElem);

    trimElem.id         = 'trim-widget';
    trimElem.innerHTML  = //
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

    setTimeout(function() {
      container.append(trimElem);
      initListeners();
      setInterval(widgetStep, 125);
    }, 125);
  }

  // Function which initialises the listeners on widget elements.
  function initListeners() {
    let statusElem = document.querySelector('#trim-status');
    let formElem   = document.querySelector('#trim-form');
    let boxElem    = document.querySelector('#trim-box');

    statusElem.onmouseover = showStatus;
    statusElem.onmouseout  = hideStatus;
    formElem.onsubmit      = updateEntry;
    boxElem.onclick        = hideBox;

    // Function which handles mouseover event on trim-status.
    function showStatus(event) {
      let player  = document.querySelector('#movie_player');
      let vidId   = player.getVideoData()['video_id'];
      let boxElem = document.querySelector('#trim-box');
      let boxHtml = 'Oops, something went wrong!';

      const trimmed   = '<i class="material-icons">info</i>&nbsp;&nbsp;Video is trimmed. Set start and end to -1 to delete entry.';
      const untrimmed = '<i class="material-icons">info</i>&nbsp;&nbsp;Video is not trimmed. Set start and end time to trim.';

      if (DICT[vidId]) boxHtml = trimmed;
      else boxHtml = untrimmed;

      boxElem.style.background = 'rgba(42, 45, 50, 0.85)';
      boxElem.innerHTML        = boxHtml

      boxElem.classList.remove('show-notification');
      boxElem.classList.add('show-status');
    }

    // Function which handles mouseout event on trim-status.
    function hideStatus(event) {
      document.querySelector('#trim-box').classList.remove('show-status');
    }

    // Function which handles submission of trim-form.
    function updateEntry(event) {
      event.preventDefault();

      let player     = document.querySelector('#movie_player');
      let vidId      = player.getVideoData()['video_id'];
      let inputStart = document.querySelector('#trim-start');
      let inputEnd   = document.querySelector('#trim-end');
      let startTime  = timeToSec(inputStart.value);
      let endTime    = timeToSec(inputEnd.value);
      let vidTitle   = (document.querySelector('.title > yt-formatted-string:nth-child(1)')
                     || document.querySelector('#eow-title')).innerHTML.trim();

      if (startTime > player.getDuration()) startTime = player.getDuration();
      if (endTime > player.getDuration()) endTime = player.getDuration();

      if (player.getVideoData()['isLive']) showNotification(3);
      else if (startTime == -1 && endTime == -1) {
        showNotification(1);
        delete DICT[vidId];
        localStorage.setItem('dict', JSON.stringify(DICT));
      }
      else if (startTime >= 0 && startTime <= endTime) {
        showNotification(0);
        DICT[vidId] = [startTime, endTime, vidTitle];
        localStorage.setItem('dict', JSON.stringify(DICT));
      }
      else showNotification(2);

      inputStart.value = '';
      inputEnd.value   = '';

      // Function which sets the styles and displays notifications on trim-box.
      function showNotification(code) {
        let boxElem = document.querySelector('#trim-box');
        let boxBgrd = 'transparent';
        let boxHtml = 'Oops, something went wrong!';

        const saved   = '<i class="material-icons">done</i>&nbsp;&nbsp;Trim successfully saved!';
        const deleted = '<i class="material-icons">delete</i>&nbsp;&nbsp;Trim Successfully deleted!';
        const invalid = '<i class="material-icons">report_problem</i>&nbsp;&nbsp;Invalid input, please try again.';
        const live    = '<i class="material-icons">report_problem</i>&nbsp;&nbsp;Unable to trim live videos.';

        if (code === 0) {
          boxBgrd = 'rgba(46, 213, 115, 0.85)';
          boxHtml = saved;
        }
        else if (code === 1) {
          boxBgrd = 'rgba(214, 48, 49, 0.85)';
          boxHtml = deleted;
        }
        else if (code === 2) {
          boxBgrd = 'rgba(253, 203, 110, 0.85)';
          boxHtml = invalid;
        }
        else if (code === 3) {
          boxBgrd = 'rgba(253, 203, 110, 0.85)';
          boxHtml = live;
        }

        boxElem.style.background = boxBgrd;
        boxElem.innerHTML        = boxHtml

        boxElem.classList.remove('show-status');
        boxElem.classList.add('show-notification');

        setTimeout(() => { boxElem.classList.remove('show-notification') }, 2500);
      }
    }

    // Function which handles click event on trim-box.
    function hideBox(event) {
      document.querySelector('#trim-box').classList.remove('show-status', 'show-notification');
    }
  }

  // Function which handles the widget Ui.
  function widgetStep() {
    let player = document.querySelector('#movie_player');
    let vidId  = null;
    if (player) vidId = player.getVideoData()['video_id'];

    let inputStart = document.querySelector('#trim-start');
    let inputEnd   = document.querySelector('#trim-end');
    let trimElem   = document.querySelector('#trim-widget');
    let statusElem = document.querySelector('#trim-status');
    let boxElem    = document.querySelector('#trim-box');
    let container  = document.querySelector('#yt-masthead-content');
    let searchBar  = document.querySelector('#masthead-search');

    if (!vidId || !player.getDuration()) hideWidget();
    else {
      if (container && searchBar && container.offsetWidth - searchBar.offsetWidth < trimElem.offsetWidth) hideWidget();
      else showWidget();

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

    function showWidget() {
      trimElem.style.display       = '';
      trimElem.style.visibility    = 'visible';
      trimElem.style.opacity       = 1;
      trimElem.style.pointerEvents = '';
    }

    function hideWidget() {
      trimElem.style.opacity       = 0;
      trimElem.style.pointerEvents = 'none';
      boxElem.classList.remove('show-status', 'show-notification');
    }
  }
}

const MAIN_STMT = [[trim, FN_EXEC]];

document.addEventListener('DOMContentLoaded', function() {
  injectCssSrc('https://fonts.googleapis.com/icon?family=Material+Icons');
  injectCssSrc('https://cdn.rawgit.com/JiangYeap/user-scripts/738b2607/youtube-trimmer/base.css');
  injectJsSrc('https://cdn.rawgit.com/JiangYeap/user-scripts/738b2607/utils/string-format.js');
  injectJsSrc('https://cdn.rawgit.com/JiangYeap/user-scripts/738b2607/utils/time-conversion.js');
  injectJs(MAIN_STMT);
}, false);
