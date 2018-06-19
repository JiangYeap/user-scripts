// ==UserScript==
// @name           Youtube Trimmer
// @version        1.3
// @include        https://www.youtube.com/*
// @description    Starts Youtube video at start mark and skips to end of video when current time exceeds end mark.
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/yt-trimmer/yt-trimmer.widget-ui-1.3.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/yt-trimmer/yt-trimmer.player-ui-1.3.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/inject-script.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/inject-style.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/url-param.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/elem-loaded.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/time-conversion.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/949a02fb/utils/string-format.js
// @grant          none
// @author         Jiang Yeap
// ==/UserScript==

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
    console.log(vidTitle + ' <' + vidId + '> is no longer trimmed.');
    delete DICT[vidId];
    localStorage.setItem('dict', JSON.stringify(DICT));
  }
  else if (startTime >= 0 && startTime <= endTime) {
    console.log(vidTitle + ' <' + vidId + '> will be trimmed to [' + secToTime(startTime) + ', ' + secToTime(endTime) + ']');
    DICT[vidId] = [startTime, endTime, vidTitle];
    localStorage.setItem('dict', JSON.stringify(DICT));
  }
}

// Function which trims videos by performing checks on intervals.
function trim() {
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

  setInterval(step, 250);
}

const DICT_STR   = 'let DICT = JSON.parse(localStorage.getItem("dict")) || {};';
const LSTNRS_STR = 'document.querySelector("#trim-form").addEventListener("submit", ' + updateEntry + ');';

const MAIN_STMT = [[DICT_STR, STR_INJ], [getUrlParameter, FN_DEF], [secToTime, FN_DEF], [timeToSec, FN_DEF], [trim, FN_EXEC], [FORMAT_STR, STR_INJ], [updatePlayerUi, FN_EXEC]];
const GUI_STMT  = [[LSTNRS_STR, STR_INJ], [updateWidgetUi, FN_EXEC]];

// Injects main logic of script immediately.
injectJs(MAIN_STMT);

// Injects GUI after header loads.
onElemLoad('#yt-masthead-content, ytd-searchbox.style-scope',
           () => { setWidgetUi(); injectCss(CSS_STR); injectJs(GUI_STMT) });
