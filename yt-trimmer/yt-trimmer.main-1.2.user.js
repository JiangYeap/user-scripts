// ==UserScript==
// @name           Youtube Test
// @include        https://www.youtube.com/*
// @description    Starts Youtube vvidIdeo at start mark and skips to end of vvidIdeo when current time hits end mark.
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/c9e725f7/utils/inject.script-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/c9e725f7/utils/inject.style-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/c9e725f7/utils/urlparam-1.0.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/c9e725f7/yt-trimmer/yt-trimmer.gui-1.1.js
// @grant          none
// @run-at         document-start
// @author         Jiang Yeap
// ==/UserScript==

// Function which handles submission of trim-form.
function updateDict(event) {
  event.preventDefault();
  let inputStart = parseInt(document.querySelector('#trim-start').value);
  let inputEnd   = parseInt(document.querySelector('#trim-end').value);
  let vidId      = getUrlParameter('v');
  let vidTitle   = (document.querySelector('.title > yt-formatted-string:nth-child(1)')
                 || document.querySelector('#eow-title')).innerHTML.trim();

  if (inputStart == -1 && inputEnd == -1) {
    console.log(vidTitle + ' <' + vidId + '> is no longer trimmed.');
    delete DICT[vidId];
    localStorage.setItem('dict', JSON.stringify(DICT));
  }
  else if (inputStart <= inputEnd && inputStart >= 0 && inputEnd >= 0) {
    console.log(vidTitle + ' <' + vidId + '> will be trimmed to [' + inputStart + ', ' + inputEnd + ']');
    DICT[vidId] = [inputStart, inputEnd, vidTitle];
    localStorage.setItem('dict', JSON.stringify(DICT));
  }
}

function updateUi(vidId) {
  let inputStart = document.querySelector('#trim-start');
  let inputEnd   = document.querySelector('#trim-end');
  let trimElem   = document.querySelector('#trim-box');
  let trimStatus = document.querySelector('#trim-status');

  if (!vidId)
    trimElem.style.visibility = 'hidden';
  else {
    trimElem.style.visibility = 'visible';

    if (DICT[vidId]) {
      inputStart.placeholder      = DICT[vidId][0];
      inputEnd.placeholder        = DICT[vidId][1];
      trimStatus.style.background = '#59ABE3';
      trimStatus.title            = 'Video is trimmed. Set start and end to -1 to delete entry.';
    }
    else {
      inputStart.placeholder      = '';
      inputEnd.placeholder        = '';
      trimStatus.style.background = '#888888';
      trimStatus.title            = 'Video is not trimmed. Set start and end time to trim.';
    }
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

const MAIN_STMT = [[DICT_STR, STR_INJ], [getUrlParameter, FN_DEF], [trim, FN_EXEC], [updateUi, FN_DEF]]
const GUI_STMT  = [[UPDTUI_STR, STR_INJ], [LSTNRS_STR, STR_INJ]];

// Injects main logic of script on load.
window.addEventListener('load', () => { injectJs(MAIN_STMT) });

// Injects GUI after header loads.
onElemLoad('#yt-masthead-content, ytd-searchbox.style-scope',
           () => { setUi(); injectCss(CSS_STR); injectJs(GUI_STMT) });
