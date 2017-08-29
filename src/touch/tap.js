import device from '../utils/device-query';
import dispatchEvent from '../utils/dispatch-custom-event';

if (device.isMobile) {
  let isTap, x, y, ts;
  document.addEventListener('touchstart', function(e) {
    //let tag = e.target.tagName.toLowerCase();
    //if (tag === 'input' || tag === 'textarea') return;
    isTap = true;
    let t = e.touches[0];
    x = t.pageX;
    y = t.pageY;
    ts = +new Date();
  });
  document.addEventListener('touchmove', function(e) {
    if (isTap) {
      let t = e.changedTouches[0];
      if (Math.abs(x - t.pageX) > 10 || Math.abs(y - t.pageY) > 10) {
        isTap = false;
      }
    }
  });
  document.addEventListener('touchend', function(e) {
    let ms = +new Date() - ts;
    if (isTap && ms < 500) {
      //let tag = e.target.tagName.toLowerCase();
      //let canBubble = (tag !== 'input' && tag !== 'textarea');
      dispatchEvent(e.target, 'tap', true, true, undefined, e);
    }
    isTap = false;
  });
} else {
  document.addEventListener('click', function(e) {
    dispatchEvent(e.target, 'tap', true, true, e);
  });
}
