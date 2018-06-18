// ==UserScript==
// @name           Youtube Test
// @include        https://www.youtube.com/*
// @description    Starts Youtube vvidIdeo at start mark and skips to end of vvidIdeo when current time hits end mark.
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/6352b708/yt-trimmer/yt-trimmer.gui-1.2.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/c9e725f7/utils/inject.script-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/c9e725f7/utils/inject.style-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/c9e725f7/utils/urlparam-1.0.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/6352b708/utils/elem-loaded.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/6352b708/utils/time-to-sec.js
// @grant          none
// @run-at         document-start
// @author         Jiang Yeap
// ==/UserScript==

// Function which handles submission of trim-form.
function updateDict(event) {
  event.preventDefault();

  let inputStart = document.querySelector('#trim-start').value;
  let inputEnd   = document.querySelector('#trim-end').value;
  let startTime  = timeToSec(inputStart);
  let endTime    = timeToSec(inputEnd);
  let vidId      = getUrlParameter('v');
  let vidTitle   = (document.querySelector('.title > yt-formatted-string:nth-child(1)')
                 || document.querySelector('#eow-title')).innerHTML.trim();

  if (startTime == -1 && endTime == -1) {
    console.log(vidTitle + ' <' + vidId + '> is no longer trimmed.');
    delete DICT[vidId];
    localStorage.setItem('dict', JSON.stringify(DICT));
  }
  else if (startTime <= endTime && startTime >= 0 && endTime >= 0) {
    console.log(vidTitle + ' <' + vidId + '> will be trimmed to [' + inputStart + ', ' + inputEnd + ']');
    DICT[vidId] = [startTime, endTime, vidTitle];
    localStorage.setItem('dict', JSON.stringify(DICT));
  }
}

// Main function with intervals.
function trim() {
  // Step function which performs checks on playing video.
  function step() {
    let vidId  = getUrlParameter('v');
    let player = document.querySelector('#movie_player');

    if (DICT[vidId] && player) {
      let currentTime = player.getCurrentTime();
      let startTime   = DICT[vidId][0];
      let endTime     = DICT[vidId][1];
      if (Math.floor(currentTime) < startTime) player.seekTo(startTime);
      if (Math.floor(currentTime) >= endTime) player.seekTo(player.getDuration());
    }
  }

  // Loops the step function twice per second.
  setInterval(step, 500);
}

const DICT_STR   = 'let DICT = JSON.parse(localStorage.getItem("dict")) || {};';
const LSTNRS_STR = 'document.querySelector("#trim-form").addEventListener("submit", ' + updateDict + ');';
const UPDTUI_STR = 'setInterval(() => { updateUi(getUrlParameter("v")) }, 500)';

const MAIN_STMT = [[DICT_STR, STR_INJ], [getUrlParameter, FN_DEF], [trim, FN_EXEC], [updateUi, FN_DEF], [secToTime, FN_DEF], [timeToSec, FN_DEF]]
const GUI_STMT  = [[UPDTUI_STR, STR_INJ], [LSTNRS_STR, STR_INJ]];

// Injects main logic of script on load.
window.addEventListener('load', () => { injectJs(MAIN_STMT) });

// Injects GUI after header loads.
onElemLoad('#yt-masthead-content, ytd-searchbox.style-scope',
           () => { setUi(); injectCss(CSS_STR); injectJs(GUI_STMT) });
