// ==UserScript==
// @name           Youtube Video Trimmer
// @include        https://www.youtube.com/*
// @description    Starts Youtube video at start mark and skips to end of video when current time hits end mark.
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/9ebfd076/utils/inject.script-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/5807bac9/utils/inject.style-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/fab94c8c/utils/urlparam-1.0.js
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/9ebfd076/yt-trimmer/yt-trimmer.gui-1.0.js
// @author         Jiang Yeap
// ==/UserScript==

// Function which handles submission of trim-form.
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
  function updateUi(id) {
		let trimElem   = document.getElementById('trim-box');
		let trimStatus = document.getElementById('trim-status');

    if (!id)
		  trimElem.style.visibility     = 'hidden';
    else {
			trimElem.style.visibility     = 'visible';
      if (DICT[id]) {
        let strt                    = document.getElementById('start-time');
        let end                     = document.getElementById('end-time');
        strt.placeholder            = DICT[id][0];
        end.placeholder             = DICT[id][1];
        trimStatus.style.background = '#59ABE3';
        trimStatus.title            = 'Video is trimmed. Set start and end to -1 to delete entry.';
      }
      else {
        trimStatus.style.background = '#888888';
        trimStatus.title            = 'Video is not trimmed. Set start and end time to trim.';
      }
    }
  }

  // Step function which performs checks on playing video.
  function step() {
    let id   = getUrlParameter('v');
    let plyr = document.getElementById('movie_player');
    updateUi(id);

    if (DICT[id] && plyr) {
	 	  let time = plyr.getCurrentTime();
   	  let strt = DICT[id][0];
   	  let end  = DICT[id][1];
      if (Math.floor(time) < strt) plyr.seekTo(strt);
   	  if (Math.floor(time) >= end) plyr.seekTo(plyr.getDuration());
    }
  }

	// Loops the step function twice per second.
	setInterval(step, 500);
}

const DICT_STR   = 'let DICT = JSON.parse(localStorage.getItem("dict")) || {};';
const LSTNRS_STR = 'document.getElementById("trim-form").addEventListener("submit", ' + updateDict + ');';
const STMTS_STR  = [[DICT_STR, STR_INJ], [setUI, FN_EXEC], [getUrlParameter, FN_DEF], [LSTNRS_STR, STR_INJ], [trim, FN_EXEC]];

injectCss(CSS_STR);
injectJs(STMTS_STR);
