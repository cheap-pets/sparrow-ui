export default function dispatchCustomEvent (el, eventName, canBubble, cancelable, detail) {
  let e = document.createEvent('CustomEvent');
  e.initCustomEvent(eventName, canBubble, cancelable, detail);
  return el.dispatchEvent(e);
};
