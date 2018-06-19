// Function which converts time from string of <hh:mm:ss> format.
function timeToSec(time) {
  let seconds = NaN;
  let timeSeg = time.split(':').reverse();
  let numSeg  = timeSeg.length;

  if (numSeg > 3) return NaN;
  for (let i = 0; i < numSeg; i ++) {
    let number = parseInt(timeSeg[i]);

    if (numSeg === 1) seconds = number;
    else {
      if (i === 0 && number < 60) seconds = number;
      else if (i === 1 && number < 60) seconds += number * 60;
      else if (i === 2) seconds += number * 3600;
    }
  }

  return seconds;
}

// Function which converts seconds into string of <(hh):mm:ss> format.
function secToTime(seconds) {
  let time = null;
  let hour = 0 | seconds / 3600;
  seconds -= hour * 3600;

  let min  = 0 | seconds / 60;
  let sec  = 0 | seconds % 60;

  if (String(sec).length < 2) sec = '0' + sec;
  if (hour) {
    if (String(min).length < 2) min = '0' + min;
    time = hour + ':' + min + ':' + sec;
  }
  else time = min + ':' + sec;

  return time;
}
