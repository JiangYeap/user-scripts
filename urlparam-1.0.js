// Argument queryParam is the parameter wanted from query string.
function getUrlParameter(queryParam) {
  let url     = decodeURIComponent(window.location.search.substring(1));
  let urlVars = url.split('&');
  let urlParam;
  let i;

  for (i = 0; i < urlVars.length; i += 1) {
    urlParam = urlVars[i].split('=');
    if (urlParam[0] === queryParam)
      return urlParam[1] === undefined ? true : urlParam[1];
  }
}
