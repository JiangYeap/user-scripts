function updatePlayerUi() {
  let barBg    = 'linear-gradient(to right, transparent {0}%, rgba(129, 236, 236, 0.40) {0}%, rgba(129, 236, 236, 0.40) {1}%, transparent {1}%)';
  let playedBg = 'linear-gradient(to right, rgba(255, 0, 0, 0.25) {0}%, #d63031 {0}%, #d63031 {1}%, rgba(255, 0, 0, 0.25) {1}%)';
  let loadedBg = 'linear-gradient(to right, transparent {0}%, rgba(188, 188, 188, 0.88) {0}%, rgba(188, 188, 188, 0.88) {1}%, transparent {1}%)';

  setInterval(playerStep, 125);

  function playerStep() {
    let player = document.querySelector('#movie_player');
    let vidId  = null;
    if (player) vidId = player.getVideoData()['video_id'];

    if (DICT[vidId]) {
      let vidLength   = player.getDuration();
      let currentTime = player.getCurrentTime();
      let loadedTime  = player.getVideoLoadedFraction() * vidLength;
      let startTime   = DICT[vidId][0];
      let endTime     = DICT[vidId][1];

      let vidBar      = document.querySelector('.ytp-progress-list');
      let vidPlayed   = document.querySelector('.ytp-play-progress');
      let vidLoaded   = document.querySelector('.ytp-load-progress');

      let barStart    = (startTime + 0.33) / vidLength * 100;
      let barEnd      = (endTime - 0.33) / vidLength * 100;
      let playedStart = startTime / currentTime * 100;
      let playedEnd   = 100;
      let loadedStart = startTime / loadedTime * 100;
      let loadedEnd   = 100;

      if (currentTime >= endTime) playedEnd = endTime / currentTime * 100;
      if (loadedTime >= endTime) loadedEnd = endTime / loadedTime * 100;

      vidBar.style.background    = barBg.format(barStart, barEnd);
      vidPlayed.style.background = playedBg.format(playedStart, playedEnd);
      vidLoaded.style.background = loadedBg.format(loadedStart, loadedEnd);
    }
    else if (player) {
      let vidBar      = document.querySelector('.ytp-progress-list');
      let vidPlayed   = document.querySelector('.ytp-play-progress');
      let vidLoaded   = document.querySelector('.ytp-load-progress');

      vidBar.style.background    = '';
      vidPlayed.style.background = '';
      vidLoaded.style.background = '';
    }
  }
}
