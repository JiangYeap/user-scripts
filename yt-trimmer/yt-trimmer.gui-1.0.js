let CSS_STR = //
  `
    #trim-box {
        float: right;
        visibility: hidden;
        width: auto;
        height: 23px;
        line-height: 23px;
        margin-top: -27px;
    }

    #trim-box > * {
        line-height: normal;
        vertical-align: middle;
    }

    #trim-status {
        display: inline-block;
        background: #888888;
        width: 1em;
        height: 1em;
        border-radius: 50%;
    }

    #trim-form {
        display: inline-block;
        width: auto;
        height: 100%;
    }

    .trim-label {
        margin-left: 0.9em;
    }

    .trim-input {
        width: 3em;
    }

  `

// Function which initialises UI for application.
function setUi() {
  let ytVersion      = 0;
  let trimElem       = document.createElement('span');
  let container      = document.getElementById('yt-masthead-content');
  if (!container) {
    container = document.getElementsByTagName('ytd-searchbox')[0];
    ytVersion = 1;
  }

  trimElem.id        = 'trim-box';
  trimElem.innerHTML = //
    `
      <span id="trim-status"></span>
      <form id="trim-form">
          <label for="start-time" class="trim-label">Start: </label>
          <input id="start-time" class="trim-input" type="number" />
          <label for="end-time" class="trim-label">End: </label>
					<input id="end-time" class="trim-input" type="number" />
          <button type="submit">Confirm</button>
      </form>
    `

  container.append(trimElem);
}
