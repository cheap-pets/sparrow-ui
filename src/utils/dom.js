export function addElement (parentNode, tagName, attributes, innerHTML) {
  let el = document.createElement(tagName);
  if (attributes) {
    for (let a in attributes) {
      if (a === 'style') {
        for (let s in attributes.style) {
          el.style[s] = attributes.style[s];
        }
      } else el[a] = attributes[a];
    }
  }
  if (innerHTML) el.innerHTML = innerHTML;
  parentNode.appendChild(el);
  return el;
}

export function isInput (el) {
  let tag = el ? el.tagName.toLowerCase() : null;
  return tag === 'input' || tag === 'textarea';
}

export function getActiveInput (parentEl) {
  let actEl = document.activeElement;
  let isInputActive = isInput(actEl);
  let el;
  if (isInputActive) {
    if (parentEl) {
      let p = actEl.parentNode;
      while (p && p !== document.body) {
        if (p === parentEl) {
          el = actEl;
          break;
        }
        p = p.parentNode;
      }
    } else el = actEl;
  }
  return el;
}
