// ==UserScript==
// @name           Youtube Video Trimmer
// @include        https://www.youtube.com/*
// @description    Starts Youtube video at start mark and skips to end of video when current time hits end mark.
// @require        https://cdn.rawgit.com/JiangYeap/user_scripts/2456b5ab/utils/inject.script-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user_scripts/2456b5ab/utils/inject.style-1.1.js
// @require        https://cdn.rawgit.com/JiangYeap/user_scripts/2456b5ab/utils/urlparam-1.0.js
// @author         Jiang Yeap
// ==/UserScript==

// Function which handles submit of new-trim.
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

// Function which initialises UI for application.
function setUI() {
  let container   = document.getElementById('yt-masthead-content');
  let form        = document.createElement('form');

  form.style      = 'float:right;height:23px;margin-top:-2em';
  form.id         = 'new-trim';
  form.innerHTML  = //
   `<div id="trim-status" style="background:#888888;width:1em;height:1em;border-radius:50%;vertical-align:middle;display:inline-block"></div>
    <label for="start-time" style="margin-left:1.2em">Start: </label>
    <input id="start-time" type="number" style="width:3em" required="requried" />
    <label for="end-time" style="margin-left:0.9em">End: </label><input id="end-time" type="number" style="width:3em" required="required" />
    <button type="submit" style="margin-left:0.9em">Confirm</button>`;
  form.style.visibility = 'hidden';
	
  container.append(form);
}

// Main function with intervals.
function trim() {
  function updateFormUI(id) {
    if (!id) document.getElementById('new-trim').style.visibility = 'hidden';
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
      document.getElementById('new-trim').style.visibility = 'visible';
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
   	  if (Math.floor(time) == end) plyr.seekTo(plyr.getDuration());
    }
  }

	setInterval(stepEvent, 500);
}

let globalDict = 'let DICT = JSON.parse(localStorage.getItem("dict")) || {};';
let listener   = 'document.getElementById("new-trim").addEventListener("submit", ' + updateDict + ');';
let statements = [[globalDict, STR], [setUI, FN_EXEC], [getUrlParameter, FN_DEF], [listener, STR], [trim, FN_EXEC]];

injectJs(statements);
