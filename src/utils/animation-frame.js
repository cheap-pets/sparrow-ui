//impl "requestAnimationFrame" & “cancelAnimationFrame” if not exist.

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame;

window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame;

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (fn) {
    return window.setTimeout(fn, 100 / 6);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (h) {
    clearTimeout(h);
  };
}
