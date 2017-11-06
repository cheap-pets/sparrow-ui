(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.sparrow = {})));
}(this, (function (exports) { 'use strict';

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

const platform = isWindows ? 'windows' : isAndroid ? 'android' : isIos ? 'ios' : 'unknow';

if (isMobile) {
  window.document.documentElement.classList.add('mobile');
}

function orientation() {
  return window.innerHeight / window.innerWidth < 1 ? 'landscape' : 'portrait';
}

var device = {
  isMobile,
  isIphone,
  isIpad,
  isIpod,
  isAndroidPhone,
  isWindowsPhone,
  platform: platform,
  orientation: orientation
};

//impl "requestAnimationFrame" & “cancelAnimationFrame” if not exist.

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (fn) {
    return window.setTimeout(fn, 100 / 6);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (h) {
    clearTimeout(h);
  };
}

const MAX_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let dateOptions = {
  DAY_SHORT_NAMES: ['日', '一', '二', '三', '四', '五', '六']
};

function isLeapMonth(year, month) {
  return month === 1 && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0);
}

//examples: getMaxDaysOfMonth(2017, 7) => 31
function getMaxDaysOfMonth(year, month) {
  return isLeapMonth(year, month) ? 29 : MAX_DAYS[month];
}

//example: formatDate(date, 'yyyy-MM-dd hh:mm:ss.SSS');
function formatDate(date, format) {
  format = format || 'yyyy-MM-dd';
  let y = date.getFullYear();
  let o = {
    'M+': date.getMonth() + 1, //月
    'd+': date.getDate(), //日
    'h+': date.getHours(), //时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'S+': date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, ('' + y).substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      let v;
      if (RegExp.$1.length === 2) {
        v = ('00' + o[k]).substr(('' + o[k]).length);
      } else if (RegExp.$1.length === 3) {
        v = ('000' + o[k]).substr(('' + o[k]).length);
      } else v = o[k];
      format = format.replace(RegExp.$1, v);
    }
  }
  return format;
}

function convertPlainDate(date) {
  if (typeof date === 'string') {
    date = new Date(Date.parse(date.replace(/-/g, '/')));
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    day: dateOptions.DAY_SHORT_NAMES[date.getDay()]
  };
}

const DAY_NAMES = dateOptions.DAY_SHORT_NAMES;

function fillDayRows(year, month, rows) {
  //初始化空的月历数组
  if (!rows.length) {
    for (let i = 0; i < 6; i++) {
      let row = [];
      for (let j = 0; j < 7; j++) {
        row.push(null);
      }
      rows.push(row);
    }
  }
  //当月最大天数
  let maxDays = getMaxDaysOfMonth(year, month);
  //当月1日星期几
  let firstDay = new Date(year, month, 1).getDay();

  let n = 1;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if ((i !== 0 || j >= firstDay) && n <= maxDays) {
        if (rows[i].$set) {
          rows[i].$set(j, n);
        } else {
          rows[i][j] = n;
        }
        n++;
      } else {
        if (rows[i].$set) {
          rows[i].$set(j, null);
        } else {
          rows[i][j] = null;
        }
      }
    }
  }
}

var Calendar = { render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "calendar" }, [_c('div', { staticClass: "calendar-header" }, [_c('span', [_vm._v(_vm._s(_vm.plainDate.year) + " 年")]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.plainDate.month + 1) + " 月 " + _vm._s(_vm.plainDate.date) + " 日， 星期" + _vm._s(_vm.plainDate.day))])]), _vm._v(" "), _c('div', { staticClass: "bar bar-menu bar-tab" }, [_c('a', { staticClass: "btn btn-link", on: { "tap": function ($event) {
          _vm.go(-1, 0);
        } } }, [_vm._v("上一年")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "tap": function ($event) {
          _vm.go(0, -1);
        } } }, [_vm._v("上一月")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "tap": function ($event) {
          _vm.go(null);
        } } }, [_vm._v("本月")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "tap": function ($event) {
          _vm.go(0, 1);
        } } }, [_vm._v("下一月")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "tap": function ($event) {
          _vm.go(1, 0);
        } } }, [_vm._v("下一年")])]), _vm._v(" "), _c('table', { staticClass: "calendar-body" }, [_c('thead', _vm._l(_vm.dayNames, function (n, index) {
      return _c('th', { key: index }, [_vm._v(_vm._s(n))]);
    })), _vm._v(" "), _c('tbody', _vm._l(_vm.dayRows, function (row, index) {
      return _c('tr', { key: index }, _vm._l(row, function (date, idx) {
        return _c('td', { key: idx, on: { "tap": function ($event) {
              _vm.selectCell(date, idx);
            } } }, [date === _vm.plainDate.date ? _c('a', { staticClass: "date-block active" }, [_vm._v(_vm._s(date))]) : date === _vm.plainToday.date && _vm.plainDate.year === _vm.plainToday.year && _vm.plainDate.month === _vm.plainToday.month ? _c('a', { staticClass: "date-block today" }, [_vm._v(_vm._s(date))]) : date ? _c('a', [_vm._v(_vm._s(date))]) : _vm._e()]);
      }));
    }))])]);
  }, staticRenderFns: [],
  props: ['dateValue'],
  computed: {
    dayNames() {
      return DAY_NAMES;
    }
  },
  data() {
    let today = new Date();
    let plainToday = convertPlainDate(today);
    let plainDate = convertPlainDate(today);
    return {
      view: 'days',
      plainToday,
      plainDate,
      dayRows: []
    };
  },
  created() {
    let d = this.dateValue;
    if (d) {
      this.plainDate = convertPlainDate(d);
    }
    this.resetCells();
  },
  methods: {
    resetCells() {
      fillDayRows(this.plainDate.year, this.plainDate.month, this.dayRows);
    },
    selectCell(date, idx) {
      if (date) {
        let pd = this.plainDate;
        pd.date = date;
        pd.day = DAY_NAMES[idx];
        this.$emit('datechange', new Date(pd.year, pd.month, pd.date));
      }
    },
    go(diffY, diffM) {
      let y;
      let m;
      let pd = this.plainDate;
      if (diffY === null) {
        let pt = this.plainToday;
        y = pt.year;
        m = pt.month;
      } else {
        y = pd.year + diffY;
        m = pd.month + diffM;
      }
      let d = pd.date;
      if (m < 0) {
        y--;
        m = 11;
      } else if (m > 11) {
        y++;
        m = 0;
      }
      let max = getMaxDaysOfMonth(y, m);
      if (d > max) {
        d = max;
      }
      let date = new Date(y, m, d);
      this.plainDate = convertPlainDate(date);
      this.resetCells();
    }
  },
  watch: {
    'dateValue': function (v) {
      this.plainDate = convertPlainDate(v);
      this.resetCells();
    }
  }
};

var calendarInput = { render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "input-group inset-icon dropdown-group" }, [_c('input', { attrs: { "type": "text", "dropdown-action": "toggle", "readonly": "readonly" }, domProps: { "value": _vm.date } }), _c('span', { staticClass: "input-icon icon icon-event" }), _vm._v(" "), _c('my-calendar', { staticClass: "dropdown", attrs: { "date-value": _vm.date }, on: { "datechange": _vm.dateChange } })], 1);
  }, staticRenderFns: [],
  props: ['value'],
  data() {
    return {
      date: ''
    };
  },
  components: {
    'my-calendar': Calendar
  },
  methods: {
    dateChange(date) {
      this.date = formatDate(date);
      this.$emit('datechange', date);
    }
  },
  watch: {
    'value': function (v) {
      if (v) {
        let pd = convertPlainDate(v);
        let d = new Date(pd.year, pd.month, pd.date);
        this.date = formatDate(d);
      }
    }
  },
  created() {
    let v = this.value;
    if (v) {
      let pd = convertPlainDate(v);
      let d = new Date(pd.year, pd.month, pd.date);
      this.date = formatDate(d);
    }
  }
};



var index = Object.freeze({
	Calendar: Calendar,
	CalendarInput: calendarInput
});

function dispatchCustomEvent(el, eventName, canBubble, cancelable, detail, originalEvent) {
  let e = document.createEvent('CustomEvent');
  e.initCustomEvent(eventName, canBubble, cancelable, detail);
  e.originalEvent = originalEvent;
  let ret = el.dispatchEvent(e);
  if (ret === false && originalEvent) {
    originalEvent.preventDefault();
  }
  return ret;
}

//点击事件名称
const clickEvent = device.isMobile ? 'tap' : 'click';

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
  if (el.getAttribute) {
    act = el.getAttribute(POP_ACTION_ATTR) || el.getAttribute(DD_ACTION_ATTR) || el.getAttribute(MODAL_ACTION_ATTR);
  }
  return act;
}

function findTarget(el) {
  let tar;
  if (el.getAttribute) {
    tar = el.getAttribute(POP_TARGET_ATTR) || el.getAttribute(DD_TARGET_ATTR) || el.getAttribute(MODAL_TARGET_ATTR);
  }
  return tar;
}

function findPopupElement(parent) {
  return parent.querySelector('.dropdown,.modal-mask,.popup,[popup]');
}

function isGroupElement(el) {
  let cls = el.className;
  let attr = el.getAttribute('popup-group');
  return cls.indexOf('dropdown-group') >= 0 || cls.indexOf('popup-group') >= 0 || attr !== null && attr !== undefined;
}

function isMaskElement(el) {
  return el.className && el.className.indexOf('modal-mask') >= 0;
}

//在document对象 click 或 tap 事件中处理弹出相关动作
document.addEventListener(clickEvent, function (event) {
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
    let seek = srcElement === document.body ? srcElement : srcElement.parentNode;
    let groupElement;
    let count = 0;
    while (count++ < 5 && seek && seek !== document.body) {
      action || (action = findAction(seek));
      if (action === 'none') {
        return;
      }
      target || action && (target = findTarget(seek));
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
    popupElement = popupElement || (target ? document.querySelector(target) : groupElement ? findPopupElement(groupElement) : undefined);

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
  dispatchCustomEvent(el, 'show', false, false, arg);
}
function hidePopup(el, arg) {
  el = typeof el === 'string' ? document.querySelector(el) : el;
  el.classList.remove('active');
  dispatchCustomEvent(el, 'hide', false, false, arg);
}
//兼容老的方法名
let modalOpen = showPopup;
let modalClose = hidePopup;

//点击事件名称
const clickEvent$1 = device.isMobile ? 'tap' : 'click';

//消息对话框
let sysDialog;
let callbackHandler;
function createSysDialog() {
  if (sysDialog) return;
  let el = document.createElement('div');
  el.className = 'modal-mask';
  el.innerHTML = '<div class="dialog">' + '<div class="dialog-header"><span></span><a class="dialog-close-btn" modal-action="close"></a></div>' + '<div class="dialog-body"><div class="dialog-message" style="padding: 10px;"></div></div>' + '<div class="dialog-footer">' + '<a class="btn btn-primary btn-ok" modal-action="close">确定</a>' + '<a class="btn btn-link btn-cancel" modal-action="close">取消</a>' + '</div>' + '</div>';
  document.body.appendChild(el);
  el.addEventListener(clickEvent$1, function (event) {
    if (!callbackHandler) return;
    let eventEl = event.srcElement || event.target;
    let cls = eventEl.classList;
    let act;
    if (cls.contains('modal-mask') || cls.contains('btn-cancel') || cls.contains('dialog-close-btn')) {
      act = 'cancel';
    } else if (cls.contains('btn-ok')) {
      act = 'ok';
    }
    if (act) callbackHandler(act);
  });
  sysDialog = el;
}

function showDialog(messageType, message, callback) {
  if (!sysDialog) createSysDialog();
  let h = sysDialog.querySelector('.dialog-header>span');
  let btnOk = sysDialog.querySelector('.btn-ok');
  let btnCancel = sysDialog.querySelector('.btn-cancel');
  callbackHandler = callback;
  switch (messageType) {
    case 'alert':
      h.innerText = '提示';
      btnOk.className = 'btn btn-primary btn-ok';
      btnCancel.classList.add('hidden');
      break;
    case 'confirm':
      h.innerText = '确认提示';
      btnOk.className = 'btn btn-primary btn-ok';
      btnCancel.classList.remove('hidden');
      break;
    case 'warn':
      h.innerText = '确认警告';
      btnOk.className = 'btn btn-negative btn-ok';
      btnCancel.classList.remove('hidden');
      break;
  }
  sysDialog.querySelector('.dialog-message').innerText = message;
  modalOpen(sysDialog);
}

//快速浮动消息
let sysMessagePanel;
let floatTimer;
function createSysMessagePanel() {
  if (sysMessagePanel) return;
  let el = document.createElement('div');
  el.className = 'float-message';
  document.body.appendChild(el);
  sysMessagePanel = el;
}

function quickMessage(message, type) {
  if (!sysMessagePanel) createSysMessagePanel();
  sysMessagePanel.innerText = message;
  let cls = 'float-message active ';
  cls += type === 'success' ? 'bg-success' : type === 'warn' ? 'bg-negative' : 'bg-primary';
  sysMessagePanel.className = cls;
  if (floatTimer) clearTimeout(floatTimer);
  floatTimer = setTimeout(() => {
    sysMessagePanel.className = 'float-message';
  }, 3000);
}

if (document.body) {
  createSysDialog();
  createSysMessagePanel();
} else {
  window.addEventListener('load', function () {
    createSysDialog();
    createSysMessagePanel();
  });
}

function alert(message, callback) {
  showDialog('alert', message, callback);
}
function confirm(message, callback) {
  showDialog('confirm', message, callback);
}
function warn(message, callback) {
  showDialog('warn', message, callback);
}
function showMessage(message, type) {
  quickMessage(message, type || 'info');
}

exports.device = device;
exports.vue = index;
exports.dateOptions = dateOptions;
exports.isLeapMonth = isLeapMonth;
exports.getMaxDaysOfMonth = getMaxDaysOfMonth;
exports.formatDate = formatDate;
exports.convertPlainDate = convertPlainDate;
exports.showPopup = showPopup;
exports.hidePopup = hidePopup;
exports.modalOpen = modalOpen;
exports.modalClose = modalClose;
exports.alert = alert;
exports.confirm = confirm;
exports.warn = warn;
exports.showMessage = showMessage;

Object.defineProperty(exports, '__esModule', { value: true });

})));
