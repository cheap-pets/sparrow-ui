let userAgent = window.navigator.userAgent.toLowerCase();

function hasFlag(flag) {
  return userAgent.indexOf(flag) !== -1;
}

const isWindows = hasFlag('windows');
const isWindowsPhone = isWindows && hasFlag('phone');

const isAndroid = !isWindows && hasFlag('android');
const isAndroidPhone = isAndroid && hasFlag('mobile');

const isIphone = !isWindows && hasFlag('iphone');
const isIpad = hasFlag('ipad');
const isIpod = hasFlag('ipod');
const isIos = isIphone || isIpad || isIpod;

const isMobile = isWindowsPhone || isAndroidPhone || isIphone || isIpod;

const platform = isWindows ? 'windows' : (isAndroid ? 'android' : (isIos ? 'ios' : 'unknow'));

if (isMobile) {
  window.document.documentElement.classList.add('mobile');
}

function orientation() {
  return ((window.innerHeight / window.innerWidth) < 1) ? 'landscape' : 'portrait';
}

export default {
  isMobile,
  isIphone,
  isIpad,
  isIpod,
  isAndroidPhone,
  isWindowsPhone,
  platform: platform,
  orientation: orientation
};
