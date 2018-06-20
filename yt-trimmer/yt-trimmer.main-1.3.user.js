// ==UserScript==
// @name           Youtube Trimmer
// @version        1.3
// @include        https://www.youtube.com/*
// @description    Starts Youtube video at start mark and skips to end of video when current time exceeds end mark.
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/25a055e0/yt-trimmer/yt-trimmer.widget-ui-1.3.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/25a055e0/yt-trimmer/yt-trimmer.player-ui-1.3.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/25a055e0/utils/inject-script.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/25a055e0/utils/inject-style.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/url-param.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/elem-loaded.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/time-conversion.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/string-format.js
// @grant          none
// @author         Jiang Yeap
// ==/UserScript==

// Function which handles click on trim box.
function hideBox(event) {
  document.querySelector('#trim-box').classList.remove('show-status', 'show-notification');
}

// Function which handles submission of trim-form.
function updateEntry(event) {
  event.preventDefault();

  let player     = document.querySelector('#movie_player');
  let inputStart = document.querySelector('#trim-start');
  let inputEnd   = document.querySelector('#trim-end');
  let startTime  = timeToSec(inputStart.value);
  let endTime    = timeToSec(inputEnd.value);
  let vidId      = getUrlParameter('v');
  let vidTitle   = (document.querySelector('.title > yt-formatted-string:nth-child(1)')
                 || document.querySelector('#eow-title')).innerHTML.trim();

  inputStart.value = '';
  inputEnd.value   = '';

  if (startTime > player.getDuration()) startTime = player.getDuration();
  if (endTime > player.getDuration()) endTime = player.getDuration();

  if (startTime == -1 && endTime == -1) {
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

  function showNotification(code) {
    let boxElem = document.querySelector('#trim-box');
    let boxBgrd = 'transparent';
    let boxHtml = 'Oops, something went wrong!';

    if (code === 0) {
      boxBgrd = 'rgba(46, 213, 115, 0.85)';
      boxHtml = '<i class="material-icons">done</i>&nbsp;&nbsp;Trim successfully saved!';
    }
    else if (code === 1) {
      boxBgrd = 'rgba(214, 48, 49, 0.85)';
      boxHtml = '<i class="material-icons">delete</i>&nbsp;&nbsp;Trim Successfully deleted!';
    }
    else if (code === 2) {
      boxBgrd = 'rgba(253, 203, 110, 0.85)';
      boxHtml = '<i class="material-icons">report_problem</i>&nbsp;&nbsp;Invalid input, please try again.';
    }

    boxElem.style.background = boxBgrd;
    boxElem.innerHTML        = boxHtml
    boxElem.classList.add('show-notification');

    setTimeout(() => { boxElem.classList.remove('show-notification') }, 2500);
  }
}

// Function which trims videos by performing checks on intervals.
function trim() {
  setInterval(step, 125);

  function step() {
    let player = document.querySelector('#movie_player');
    let vidId  = getUrlParameter('v');

    if (DICT[vidId] && player) {
      let currentTime = player.getCurrentTime();
      let startTime   = DICT[vidId][0];
      let endTime     = DICT[vidId][1];

      if (Math.floor(currentTime) < startTime) player.seekTo(startTime);
      if (Math.floor(currentTime) >= endTime) player.seekTo(player.getDuration());
    }
  }
}

const DICT_STR   = 'let DICT = JSON.parse(localStorage.getItem("dict")) || {};';
const FORM_LSTNR = 'document.querySelector("#trim-form").addEventListener("submit", ' + updateEntry + ');';
const BOX_LSTNR  = 'document.querySelector("#trim-box").addEventListener("click", ' + hideBox + ');';
const LSTNRS_STR = FORM_LSTNR + BOX_LSTNR;

const MAIN_STMT = [[DICT_STR, STR_INJ], [getUrlParameter, FN_DEF], [secToTime, FN_DEF], [timeToSec, FN_DEF], [trim, FN_EXEC], [FORMAT_STR, STR_INJ], [updatePlayerUi, FN_EXEC]];
const GUI_STMT  = [[initStatusListener, FN_EXEC], [LSTNRS_STR, STR_INJ], [updateWidgetUi, FN_EXEC]];

// Injects main logic of script immediately.
injectJs(MAIN_STMT);
injectCssSrc('https://fonts.googleapis.com/icon?family=Material+Icons');

// Injects GUI after header loads.
onElemLoad('#yt-masthead-content, ytd-searchbox.style-scope', () => {
  setWidgetUi();
  injectCss(CSS_STR);
  injectJs(GUI_STMT);
});
