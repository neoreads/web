export function parseHostname(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
}
