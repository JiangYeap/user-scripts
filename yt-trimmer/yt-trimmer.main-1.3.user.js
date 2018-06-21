// ==UserScript==
// @name           YouTube Trimmer
// @version        1.3
// @include        https://www.youtube.com/*
// @description    Starts YouTube video at start mark and skips to end of video when current time exceeds end mark.
// @require        https://github.com/JiangYeap/user-scripts/blob/master/yt-trimmer/yt-trimmer.listeners-1.3.user.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/82c772c6/yt-trimmer/yt-trimmer.player-ui-1.3.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/82c772c6/yt-trimmer/yt-trimmer.widget-ui-1.3.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/82c772c6/utils/elem-loaded.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/82c772c6/utils/inject-script.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/82c772c6/utils/inject-style.js
// @grant          none
// @run-at         document-end
// @author         Jiang Yeap
// ==/UserScript==

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

const STTS_LSTNR = 'document.querySelector("#trim-status").addEventListener("mouseover", ' + showStatus + ');\n';
const FORM_LSTNR = 'document.querySelector("#trim-form").addEventListener("submit", ' + updateEntry + ');\n';
const BOX_LSTNR  = 'document.querySelector("#trim-box").addEventListener("click", ' + hideBox + ');\n';

const DICT_STR   = 'let DICT = JSON.parse(localStorage.getItem("dict")) || {};\n';
const LSTNRS_STR = FORM_LSTNR + BOX_LSTNR;

const MAIN_STMT = [[DICT_STR, STR_INJ], [trim, FN_EXEC], [updatePlayerUi, FN_EXEC]];
const GUI_STMT  = [[updateWidgetUi, FN_EXEC]];

// Injects dependencies and main logic of script immediately.
injectJsSrc('https://cdn.rawgit.com/JiangYeap/user-scripts/82c772c6/utils/string-format.js');
injectJsSrc('https://cdn.rawgit.com/JiangYeap/user-scripts/82c772c6/utils/time-conversion.js');
injectJsSrc('https://cdn.rawgit.com/JiangYeap/user-scripts/82c772c6/utils/url-param.js');
injectCssSrc('https://fonts.googleapis.com/icon?family=Material+Icons');
injectJs(MAIN_STMT);

// Injects GUI after header loads.
onElemLoad('#yt-masthead-content, ytd-searchbox.style-scope', () => {
  setWidgetUi();
  injectCss(CSS_STR);
  initListeneers();
  injectJs(GUI_STMT);
});
