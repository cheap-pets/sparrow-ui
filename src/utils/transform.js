export function setTransitionDuration (el, s) {
  el.style.webkitTransitionDuration = s + 's';
}

export function getTransformY (el) {
  let s = el.style.transform || el.style.webkitTransform || '';
  let t = s.match(/translate3d\(\dpx,([^)]*)/);
  let v = t ? t[1] : 0;
  return parseInt(v, 10);
}

export function setTransformY (el, y) {
  el.style.webkitTransform = 'translate3d(0,' + y + 'px,0)';
}
