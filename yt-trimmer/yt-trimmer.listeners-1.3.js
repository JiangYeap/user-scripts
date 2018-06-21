// Function which handles click event on trim-box.
function hideBox(event) {
  document.querySelector('#trim-box').classList.remove('show-status', 'show-notification');
}

// Function which handles mouseout event on trim-status.
function hideStatus(event) {
  document.querySelector('#trim-box').classList.remove('show-status');
}

// Function which handles mouseover event on trim-status.
function showStatus(event) {
  let vidId   = getUrlParameter('v');
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

  inputStart.value = '';
  inputEnd.value   = '';

  function showNotification(code) {
    let boxElem = document.querySelector('#trim-box');
    let boxBgrd = 'transparent';
    let boxHtml = 'Oops, something went wrong!';

    const saved   = '<i class="material-icons">done</i>&nbsp;&nbsp;Trim successfully saved!';
    const deleted = '<i class="material-icons">delete</i>&nbsp;&nbsp;Trim Successfully deleted!';
    const invalid = '<i class="material-icons">report_problem</i>&nbsp;&nbsp;Invalid input, please try again.';

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

    boxElem.style.background = boxBgrd;
    boxElem.innerHTML        = boxHtml

    boxElem.classList.remove('show-status');
    boxElem.classList.add('show-notification');

    setTimeout(() => { boxElem.classList.remove('show-notification') }, 2500);
  }
}

// Function which initialises all listeners.
function initListeneers() {
  let statusElem = document.querySelector('#trim-status');
  let formElem   = document.querySelector('#trim-form');
  let boxElem    = document.querySelector('#trim-box');

  statusElem.onmouseover = showStatus;
  statusElem.onmouseout  = hideStatus;
  formElem.onsubmit      = updateEntry;
  boxElem.onclick        = hideBox;
}
