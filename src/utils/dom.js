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
  const actEl = document.activeElement;
  const isInputActive = isInput(actEl);
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

export function getBoundingClientRect (el, pEl) {
  let top;
  let left;
  if (pEl) {
    const pRect = pEl.getBoundingClientRect();
    top = pRect.top;
    left = pRect.left;
  } else {
    top = document.documentElement.clientTop;
    left = document.documentElement.clientLeft;
  }
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top - top,
    bottom: rect.bottom - top,
    left: rect.left - left,
    right: rect.right - left
  };
}
