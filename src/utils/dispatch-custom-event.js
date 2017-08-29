export default function dispatchCustomEvent (el, eventName, canBubble, cancelable, detail, originalEvent) {
  let e = document.createEvent('CustomEvent');
  e.initCustomEvent(eventName, canBubble, cancelable, detail);
  e.originalEvent = originalEvent;
  let ret = el.dispatchEvent(e);
  if (ret === false && originalEvent) {
    originalEvent.preventDefault();
  }
  return ret;
};
