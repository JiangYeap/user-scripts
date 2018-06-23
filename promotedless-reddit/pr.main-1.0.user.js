// ==UserScript==
// @name           Promotedless Reddit
// @version        1.0
// @include        https://www.reddit.com/*
// @description    Hides Reddit's annoying Promotion threads.
// @require        https://cdn.rawgit.com/JiangYeap/user-scripts/f6c0cc25/utils/inject-style.js
// @grant          none
// @run-at         document-start
// @author         Jiang Yeap
// ==/UserScript==

const CSS = '.promotedlink { display: none; }';

document.addEventListener('DOMContentLoaded', () => { injectCss(CSS) }, false);
