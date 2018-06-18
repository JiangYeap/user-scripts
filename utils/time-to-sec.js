// Function which converts time from string of <hh:mm:ss> format.
function timeToSec(time) {
  let seconds = null;
  let timeSeg = time.split(':').reverse();

  for (let i = 0; i < timeSeg.length; i ++) {
    let number = parseInt(timeSeg[i]);

    if (number < 60) {
      if (i === 0) seconds = number;
      else if (i === 1) seconds += number * 60;
      else if (i === 2) seconds += number * 3600;
    }
  }

  return seconds;
}

// Function which converts seconds into string of <(hh):mm:ss> format.
function secToTime(seconds) {
  let time = null;
  let hour = 0 | seconds / 3600;
  let min  = 0 | seconds / 60;
  let sec  = 0 | seconds % 60;

  if (hour) time = hour + ':' + min + ':' + sec;
  else time = min + ':' + sec;

  return time;
}
