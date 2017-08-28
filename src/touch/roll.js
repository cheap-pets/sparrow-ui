import '../utils/animation-frame';
import dispatchCustomEvent from '../utils/dispatch-custom-event';
import { addElement, isInput, getActiveInput } from '../utils/dom';
import { setTransitionDuration, getTransformY, setTransformY } from '../utils/transform';

export default function attachRoll(wEl, option) {
  let stage, x, y, minY, transY, releaseY;
  let el, hEl, fEl, sbEl, wh, h, hh, fh, hy, fy;
  let ts, speed, direction;
  let moveTimer, spdTimer, itlTimer;

  //prepare dom
  wEl.style.overflow = 'hidden';
  for (let i = 0; i < wEl.children.length; i++) {
    let n = wEl.children[i];
    if (n.classList.contains('roll-body')) el = n;
    else if (n.classList.contains('roll-header')) hEl = n;
    else if (n.classList.contains('roll-footer')) fEl = n;
  }
  if (!el) el = wEl.children[0];
  el.style.webkitTransition = 'transform 0s ease-in';

  function recalcSize() {
    wh = wEl.clientHeight;
    h = el.offsetHeight;
    minY = wh - h;
    if (minY > 0) minY = 0;
  }

  function calcDirection(y) {
    return y > 0 ? 1 : y < 0 ? -1 : 0;
  }

  function dispatchEvent(eventName, e) {
    let detail = {
      y: transY,
      minimumY: minY,
      releaseY: releaseY,
      direction: direction
    };
    if (e) detail.srcEvent = e;
    return dispatchCustomEvent(wEl, eventName, false, false, detail);
  }

  function setHeaderFooterState(y, final) {
    let hy0 = 0;
    let fy0 = 0;
    function activate(el) {
      el.classList.add('active');
      setTimeout(function() {
        el.classList.remove('active');
        setTransformY(el, 0);
        //el.style.opacity = 0;
      }, 1000);
    }
    if (final) {
      if (hEl && hy === hh) {
        hy0 = hy;
        activate(hEl);
        dispatchEvent('rollheaderactivate');
      } else if (fEl && fy === -fh) {
        fy0 = fy;
        activate(fEl);
        dispatchEvent('rollfooteractivate');
      }
    } else {
      if (hEl && y > 0) {
        hh = hh || hEl.offsetHeight || 100;
        hy0 = y > hh ? hh : y;
      } else if (fEl && y < minY) {
        fh = fh || fEl.offsetHeight || 100;
        fy0 = minY - y > fh ? -fh : y - minY;
      }
    }
    if (hEl && hy0 !== hy) {
      hy = hy0;
      setTransformY(hEl, hy);
      //hEl.style.opacity = hy / hh;
    }
    if (fEl && fy0 !== fy) {
      fy = fy0;
      setTransformY(fEl, fy);
      //fEl.style.opacity = -fy / fh;
    }
  }

  function doMove(y, final) {
    cancelAnimationFrame(moveTimer);
    moveTimer = requestAnimationFrame(function() {
      setTransformY(el, y);
      setHeaderFooterState(y, final);
    });
  }

  function initScrollbar() {
    if (h <= wh || !option.scrollbar) return;
    if (!sbEl) {
      sbEl = addElement(wEl, 'div', {
        style: {
          position: 'absolute',
          display: 'none',
          zIndex: 100,
          right: 0,
          width: '6px',
          borderRadius: '3px',
          backgroundColor: 'rgba(0,0,0,.3)'
        }
      });
    }
    sbEl.style.height = wh / h * wh + 'px';
    sbEl.style.display = 'block';
  }

  function setScrollPos() {
    if (h <= wh || !sbEl) return;
    sbEl.style.top = -transY * (wh / h) + 'px';
  }

  let resizeTimer;
  function refreshSize () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      let newY = null;
      let iptEl = getActiveInput(el);
      recalcSize();
      if (iptEl && iptEl.offsetTop + transY + iptEl.offsetHeight > h) {
        newY = wh - iptEl.offsetTop - iptEl.offsetHeight;
      } else {
        if (transY > 0 || transY < minY) {
          newY = transY > 0 ? 0 : minY;
        }
      }
      if (newY !== null) {
        setTransitionDuration(el, 0);
        doMove(newY);
        transY = newY;
      }
    }, 300);
  }

  window.addEventListener('resize', refreshSize);

  let startInput;
  el.addEventListener('touchstart', function(e) {
    stage = 0;
    startInput = isInput(e.target) ? e.target : undefined;
    /*
    let iptEl = getActiveInput();
    if (iptEl && iptEl !== e.target) {
      isInput(e.target) ? e.target.focus() : iptEl.blur();
      e.preventDefault();
      return;
    }
    */
    clearTimeout(spdTimer);
    cancelAnimationFrame(itlTimer);
    stage = 1;
    let t = e.touches[0];
    x = t.pageX;
    y = t.pageY;
    ts = +new Date();
  });

  el.addEventListener('touchmove', function(e) {
    let t = e.changedTouches[0];
    let deltaY = y - t.pageY;
    if (stage === 1) {
      if (Math.abs(x - t.pageX) > 10) {
        stage = 0;
      } else if (Math.abs(deltaY) > 10) {
        releaseY = transY = getTransformY(this);
        recalcSize();
        if (dispatchEvent('rollstart', e) === false) return;
        stage = 2;
        initScrollbar();
        setTransitionDuration(this, 0);
      }
    }
    if (stage === 2) {
      let tsNow = +new Date();
      speed = deltaY / (tsNow - ts);
      clearTimeout(spdTimer);
      spdTimer = setTimeout(function() {
        speed = 0;
      }, 50);
      if (transY > 0 || transY < minY) deltaY = deltaY * 0.5;
      releaseY = transY = transY - deltaY;
      ts = tsNow;
      y = t.pageY;
      doMove(transY);
      setScrollPos();
      direction = calcDirection(deltaY);
      dispatchEvent('rollmove', e);
      e.preventDefault();
      e.stopPropagation();
    }
  });

  el.addEventListener('touchend', function(e) {
    let isOut;
    function dockIn () {
      transY = transY > 0 ? 0 : minY;
      setTransitionDuration(el, 0.3);
      doMove(transY, true);
      dispatchEvent('rollend', e);
    }

    function outOfRange () {
      return transY > 0 || transY < minY;
    };

    function inertialMove () {
      let tsNow = +new Date();
      let deltaY = speed * (tsNow - ts);
      ts = tsNow;
      transY -= deltaY;
      isOut = isOut || outOfRange();
      setTransformY(el, transY);
      setScrollPos();
      dispatchEvent('rollmove', e);
      if (Math.abs(speed) > 0.01) {
        speed = speed * (isOut ? 0.5 : 0.95);
        itlTimer = requestAnimationFrame(inertialMove);
      } else {
        isOut ? dockIn() : dispatchEvent('rollend', e);
        if (sbEl) sbEl.style.display = 'none';
      }
    }

    if (stage === 2) {
      clearTimeout(spdTimer);
      e.preventDefault();
      e.stopPropagation();
      if (outOfRange()) dockIn();
      else {
        if (speed > 5) speed = 5;
        else if (speed < -5) speed = -5;
        itlTimer = requestAnimationFrame(inertialMove);
      }
    } else if (stage === 1 && startInput) {
      startInput.focus();
      e.preventDefault();
      e.stopPropagation();
    }
    stage = 0;
  });

  return {
    refreshSize
  };
};
