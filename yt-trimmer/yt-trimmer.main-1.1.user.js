// ==UserScript==
// @name           Youtube Video Trimmer
// @include        https://www.youtube.com/*
// @description    Starts Youtube video at start mark and skips to end of video when current time hits end mark.
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/fab94c8c/utils/inject.script-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/fab94c8c/utils/inject.style-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/fab94c8c/utils/urlparam-1.0.js
// @author         Jiang Yeap
// ==/UserScript==

// Function which handles addition of new trim entries.
function updateDict(event) {
	event.preventDefault();

  let strt  = parseInt(document.getElementById('start-time').value);
  let end   = parseInt(document.getElementById('end-time').value);
  let id    = getUrlParameter('v');
  let title = document.getElementById('eow-title').innerHTML.trim();

  if (strt == -1 && end == -1) {
    console.log(title + ' - ' + id + ' is no longer trimmed.');
    delete DICT[id];
    localStorage.setItem('dict', JSON.stringify(DICT));
  }

  else if (strt <= end && strt >= 0 && end >= 0) {
    console.log(title + ' - ' + id + ' will be trimmed to [' + strt + ', ' + end + ']');
    DICT[id] = [strt, end, title];
    localStorage.setItem('dict', JSON.stringify(DICT));
  }
}

// Main function with intervals.
function trim() {
  function updateFormUI(id) {
    if (!id) document.getElementById('trim-box').style.visibility = 'hidden';
    else {
      let status = document.getElementById('trim-status');
      if (DICT[id]) {
        let strt                = document.getElementById('start-time');
        let end                 = document.getElementById('end-time');
        strt.placeholder        = DICT[id][0];
        end.placeholder         = DICT[id][1];
        status.style.background = '#59ABE3';
        status.title            = 'Video is trimmed. Set start and end to -1 to delete entry.';
      }
      else {
        status.style.background = '#888888';
        status.title            = 'Video is not trimmed. Set start and end time to trim.';
      }
      document.getElementById('trim-box').style.visibility = 'visible';
    }
  }

  function stepEvent() {
    let id   = getUrlParameter('v');
    let plyr = document.getElementById('movie_player');

    updateFormUI(id);

    if (DICT[id] && plyr) {
	 	  let time = plyr.getCurrentTime();
   	  let strt = DICT[id][0];
   	  let end  = DICT[id][1];
      if (Math.floor(time) < strt) plyr.seekTo(strt);
   	  if (Math.floor(time) >= end) plyr.seekTo(plyr.getDuration());
    }
  }

	setInterval(stepEvent, 500);
}

const DICT_STR   = 'let DICT = JSON.parse(localStorage.getItem("dict")) || {};';
const LSTNRS_STR = 'document.getElementById("trim-form").addEventListener("submit", ' + updateDict + ');';
const STMTS_STR  = [[DICT_STR, STR_INJ], [setUI, FN_EXEC], [getUrlParameter, FN_DEF], [LSTNRS_STR, STR_INJ], [trim, FN_EXEC]];

injectCss(CSS_STR);
injectJs(STMTS_STR);
