let PLAYER_CSS = //
  `
    .ytp-play-progress {
        background: linear-gradient(to right, transparent 0%, transparent 50.5px, red 50.5px);
        max-width: 886px;
    }

    .ytp-progress-list {
        height: 12px !important;
        background: linear-gradient(to right, transparent {barStart}%, white {barStart}%, white {barEnd}%, transparent {barEnd}%);
        box-shadow: none;
    }

    .ytp-progress-bar-container {
        background: transparent;
        box-shadow: none;
    }

    .ytp-progress-bar {
        background: transparent;
        box-shadow: none;
    }
  `

updatePlayerUi() {
  let barBg    = 'linear-gradient(to right, transparent {0}%, white {0}%, white {1}%, transparent {1}%)';
  let playedBg = 'linear-gradient(to right, transparent {0}%, red {0}%)';

  stepUi() {
    let player = document.querySelector('#movie_player');
    let vidId  = getUrlParameter('v');

    if (DICT[vidId] && player) {
      let currentTime = player.getCurrentTime();
      let startTime   = DICT[vidId][0];
      let endTime     = DICT[vidId][1];

      let vidBar      = document.querySelector('.ytp-progress-list');
      let vidPlayed   = document.querySelector('.ytp-play-progress');
      let vidLength   = player.getDuration();

      let barLength   = vidBar.offsetWidth;
      let barStart    = startTime / vidLength * 100;
      let barEnd      = endTime / vidLength * 100;

      let playedStart = startTime / currentTime * 100;
      let playedWidth = (endTime - startTime) / vidLength * barLength + 'px';

      vidBar.style.background    = barBg.format(barStart, barEnd);
      vidPlayed.style.background = playedBg.format(playedStart);
      vidPlayed.style.maxWidth   = playedWidth;
    }
    else if (!DICT[vidId] && player) {
      let vidBar      = document.querySelector('.ytp-progress-list');
      let vidPlayed   = document.querySelector('.ytp-play-progress');

      vidBar.style.background    = '';
      vidPlayed.style.background = '';
      vidPlayed.style.maxWidth   = '';
    }
  }

  setInterval(stepUi, 250);
}
