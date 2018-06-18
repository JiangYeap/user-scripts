const CSS_OLD = //
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

const CSS_NEW = //
  `
    #trim-box {
        float: right;
        visibility: hidden;
        width: auto;
        height: 23px;
        line-height: 23px;
        margin-top: 5px;
        margin-left: 5em;
    }

    #trim-box > * {
        line-height: normal;
        vertical-align: middle;
        font-size: 1.5em;
    }

    #trim-status {
        display: inline-block;
        background: #888888;
        width: 1.1em;
        height: 1.1em;
        border-radius: 50%;
    }

    #trim-form {
        display: inline-block;
        width: auto;
        height: 100%;
        margin-top: 2px
    }

    .trim-label {
        margin-left: 0.9em;
    }

    input[type='number'] {
        -moz-appearance:textfield;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .trim-input {
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        outline: none;
        padding: 0px;
        border: none;
        border-bottom: 1px solid #ddd;
        background: transparent;
        text-align: center;
        height: 100%;
        width: 2.3em;
    }

    .trim-button {
        margin-left: 0.9em;
        background: #7BED9F;
        padding: 4px 12px 4px 12px;
        border: none;
        color: #fff;
    }

    .trim-button:hover {
        background: #4BAD5E;
        box-shadow:none;
        -moz-box-shadow:none;
        -webkit-box-shadow:none;
    }
  `

let CSS_STR = CSS_OLD;

// Function which initialises UI for application.
function setUi() {
  let trimElem  = document.createElement('span');
  let container = document.getElementById('yt-masthead-content');

  if (!container) {
    container = document.getElementsByTagName('ytd-searchbox')[0];
    CSS_STR = CSS_NEW;
  }

  trimElem.id        = 'trim-box';
  trimElem.innerHTML = //
    `
      <span id="trim-status"></span>
      <form id="trim-form">
          <label for="trim-start" class="trim-label">Start: </label>
          <input id="trim-start" class="trim-input" type="number" required="required" />
          <label for="trim-end" class="trim-label">End: </label>
					<input id="trim-end" class="trim-input" type="number" required="required" />
          <button type="submit" class="trim-button">Confirm</button>
      </form>
    `

  container.append(trimElem);
}
