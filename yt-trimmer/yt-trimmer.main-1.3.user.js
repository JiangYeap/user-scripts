// ==UserScript==
// @name           YouTube Trimmer
// @version        1.3
// @include        https://www.youtube.com/*
// @description    Starts YouTube video at start mark and skips to end of video when current time exceeds end mark.
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/76c37bc4/yt-trimmer/yt-trimmer.listeners-1.3.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/76c37bc4/yt-trimmer/yt-trimmer.player-ui-1.3.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/76c37bc4/yt-trimmer/yt-trimmer.widget-ui-1.3.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/76c37bc4/utils/elem-loaded.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/76c37bc4/utils/inject-script.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/76c37bc4/utils/inject-style.js
// @grant          none
// @run-at         document-idle
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

const DICT_STR  = 'let DICT = JSON.parse(localStorage.getItem("dict")) || {};\n';
const MAIN_STMT = [[DICT_STR, STR_INJ], [trim, FN_EXEC], [updatePlayerUi, FN_EXEC]];
const GUI_STMT  = [[updateWidgetUi, FN_EXEC]];

// Injects dependencies and main logic of script immediately.
injectCssSrc('https://fonts.googleapis.com/icon?family=Material+Icons');
injectJsSrc('https://cdn.rawgit.com/JiangYeap/user-scripts/76c37bc4/utils/string-format.js');
injectJsSrc('https://cdn.rawgit.com/JiangYeap/user-scripts/76c37bc4/utils/time-conversion.js');
injectJsSrc('https://cdn.rawgit.com/JiangYeap/user-scripts/76c37bc4/utils/url-param.js');
injectJs(MAIN_STMT);

// Injects GUI after header loads.
onElemLoad('#yt-masthead-content, ytd-searchbox.style-scope', () => {
  setWidgetUi();
  injectCss(CSS_STR);
  initListeneers();
  injectJs(GUI_STMT);
});
