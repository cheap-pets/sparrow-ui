import touchable from '../utils/touchable';
import dispatchEvent from '../utils/dispatch-custom-event';

//点击事件名称
const clickEvent = touchable ? 'tap' : 'click';

//用于弹出元素的一些元素、属性名称常量
const POP_ACTION_ATTR = 'popup-action';
const POP_TARGET_ATTR = 'popup-target';
//兼容以前的 dropdown 命名
const DD_ACTION_ATTR = 'dropdown-action';
const DD_TARGET_ATTR = 'dropdown-target';
//兼容以前的 modal 命名
const MODAL_ACTION_ATTR = 'modal-action';
const MODAL_TARGET_ATTR = 'modal-target';

function findAction(el) {
  let act;
  if (el.getAttribute) act = el.getAttribute(POP_ACTION_ATTR) || el.getAttribute(DD_ACTION_ATTR) || el.getAttribute(MODAL_ACTION_ATTR);
  return act;
}

function findTarget(el) {
  let tar;
  if (el.getAttribute) tar = el.getAttribute(POP_TARGET_ATTR) || el.getAttribute(DD_TARGET_ATTR) || el.getAttribute(MODAL_TARGET_ATTR);
  return tar;
}

function findPopupElement(parent) {
  return parent.querySelector('.dropdown,.modal-mask,.popup,[popup]');
}

function isGroupElement(el) {
  let cls = el.className;
  let attr = el.getAttribute('popup-group');
  return cls.indexOf('dropdown-group') >= 0 || cls.indexOf('popup-group') >= 0 || (attr !== null && attr !== undefined);
}

function isMaskElement(el) {
  return el.className && el.className.indexOf('modal-mask') >= 0;
}

//在document对象 click 或 tap 事件中处理弹出相关动作
document.addEventListener(clickEvent, function(event) {
  //触发事件的元素
  let srcElement = event.srcElement || event.target;
  let popupElement;
  //表示点击在空白区域
  let isMask = isMaskElement(srcElement);
  //获取指定动作
  let action = findAction(srcElement);
  if (action === 'none') {
    return;
  } else if (isMask) {
    popupElement = srcElement;
    action = 'close';
  }
  if (!isMask) {
    let target = action ? findTarget(srcElement) : undefined;

    //查找组元素（最多找5层）
    let seek = (srcElement === document.body) ? srcElement : srcElement.parentNode;
    let groupElement;
    let count = 0;
    while (count++ < 5 && seek && seek !== document.body) {
      action || (action = findAction(seek));
      target || (action && (target = findTarget(srcElement)));
      if (isMaskElement(seek)) {
        popupElement = seek;
        break;
      }
      if (isGroupElement(seek)) {
        groupElement = seek;
        break;
      }
      seek = seek.parentNode;
    }
    popupElement =
      popupElement ||
      (target ? document.querySelector(target) : groupElement ? findPopupElement(groupElement) : undefined);

    //获取并隐藏之前弹出的元素
    let lastElement = document.querySelector('.dropdown.active,.popup.active,.active[popup]');
    if (lastElement && lastElement !== popupElement) {
      lastElement.classList.remove('active');
    }
  }
  //操作当前组内下拉元素
  if (popupElement) {
    switch (action) {
      case 'open':
        popupElement.classList.add('active');
        break;
      case 'toggle':
        popupElement.classList.toggle('active');
        break;
      case 'close':
        popupElement.classList.remove('active');
        break;
    }
  }
});

//打开对话框和关闭对话框的方法
function showPopup(el, arg) {
  el = typeof el === 'string' ? document.querySelector(el) : el;
  el.classList.add('active');
  dispatchEvent(el, 'show', false, false, arg);
}
function hidePopup(el, arg) {
  el = typeof el === 'string' ? document.querySelector(el) : el;
  el.classList.remove('active');
  dispatchEvent(el, 'hide', false, false, arg);
}
//兼容老的方法名
let modalOpen = showPopup;
let modalClose = hidePopup;

export { showPopup, hidePopup, modalOpen, modalClose };
