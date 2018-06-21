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