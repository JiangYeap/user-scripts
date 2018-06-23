// ==UserScript==
// @name       	  Bezelless Wikipedia
// @version       1.0
// @include    	  https://en.wikipedia.org/*
// @description	  Hides away all the conglomerative mess of Wikipedia pages.
// @require       https://cdn.rawgit.com/JiangYeap/user-scripts/f6c0cc25/utils/inject-style.js
// @grant         none
// @run-at     	  document-start
// @author     	  Jiang Yeap
// ==/UserScript==

const CSS = //
  `
    #mw-panel, #p-personal, #mw-head, #mw-page-base, #mw-head-base {
        display: none;
    }

    #content {
        margin: 0px;
    }
  `

  document.addEventListener('DOMContentLoaded', () => { injectCss(CSS) }, false);
