import device from '../utils/device-query';
import './tap';
import attachRoll from './roll';
import { getActiveInput } from '../utils/dom';

if (device.isMobile) {
  //1. put a fn to handle A:active effect
  //2. make a focuesd input element deactivate, when touch others
  document.addEventListener('touchstart', (e) => {
    let activeInput = getActiveInput();
    if (activeInput && activeInput !== e.target) {
      activeInput.blur();
    }
  });
}

export {
  attachRoll
};
