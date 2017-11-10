(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.sparrow = {})));
}(this, (function (exports) { 'use strict';

var userAgent = window.navigator.userAgent.toLowerCase();

function hasFlag(flag) {
  return userAgent.indexOf(flag) !== -1;
}

var isWindows = hasFlag('windows');
var isWindowsPhone = isWindows && hasFlag('phone');

var isAndroid = !isWindows && hasFlag('android');
var isAndroidPhone = isAndroid && hasFlag('mobile');

var isIphone = !isWindows && hasFlag('iphone');
var isIpad = hasFlag('ipad');
var isIpod = hasFlag('ipod');
var isIos = isIphone || isIpad || isIpod;

var isMobile = isWindowsPhone || isAndroidPhone || isIphone || isIpod;

var platform = isWindows ? 'windows' : isAndroid ? 'android' : isIos ? 'ios' : 'unknow';

if (isMobile) {
  window.document.documentElement.classList.add('mobile');
}

function orientation() {
  return window.innerHeight / window.innerWidth < 1 ? 'landscape' : 'portrait';
}

var device = {
  isMobile: isMobile,
  isIphone: isIphone,
  isIpad: isIpad,
  isIpod: isIpod,
  isAndroidPhone: isAndroidPhone,
  isWindowsPhone: isWindowsPhone,
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

var MAX_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var dateOptions = {
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
  var y = date.getFullYear();
  var o = {
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
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      var v = void 0;
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

var DAY_NAMES = dateOptions.DAY_SHORT_NAMES;

function fillDayRows(year, month, rows) {
  //初始化空的月历数组
  if (!rows.length) {
    for (var i = 0; i < 6; i++) {
      var row = [];
      for (var j = 0; j < 7; j++) {
        row.push(null);
      }
      rows.push(row);
    }
  }
  //当月最大天数
  var maxDays = getMaxDaysOfMonth(year, month);
  //当月1日星期几
  var firstDay = new Date(year, month, 1).getDay();

  var n = 1;
  for (var _i = 0; _i < 6; _i++) {
    for (var _j = 0; _j < 7; _j++) {
      if ((_i !== 0 || _j >= firstDay) && n <= maxDays) {
        if (rows[_i].$set) {
          rows[_i].$set(_j, n);
        } else {
          rows[_i][_j] = n;
        }
        n++;
      } else {
        if (rows[_i].$set) {
          rows[_i].$set(_j, null);
        } else {
          rows[_i][_j] = null;
        }
      }
    }
  }
}

var Calendar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "calendar" }, [_c('div', { staticClass: "calendar-header" }, [_c('span', [_vm._v(_vm._s(_vm.plainDate.year) + " 年")]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.plainDate.month + 1) + " 月 " + _vm._s(_vm.plainDate.date) + " 日， 星期" + _vm._s(_vm.plainDate.day))])]), _vm._v(" "), _c('div', { staticClass: "bar bar-menu bar-tab" }, [_c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(-1, 0);
        } } }, [_vm._v("上一年")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(0, -1);
        } } }, [_vm._v("上一月")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(null);
        } } }, [_vm._v("本月")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(0, 1);
        } } }, [_vm._v("下一月")]), _vm._v(" "), _c('a', { staticClass: "btn btn-link", on: { "click": function click($event) {
          _vm.go(1, 0);
        } } }, [_vm._v("下一年")])]), _vm._v(" "), _c('table', { staticClass: "calendar-body" }, [_c('thead', _vm._l(_vm.dayNames, function (n, index) {
      return _c('th', { key: index }, [_vm._v(_vm._s(n))]);
    })), _vm._v(" "), _c('tbody', _vm._l(_vm.dayRows, function (row, index) {
      return _c('tr', { key: index }, _vm._l(row, function (date, idx) {
        return _c('td', { key: idx, on: { "click": function click($event) {
              _vm.selectCell(date, idx);
            } } }, [date === _vm.plainDate.date ? _c('a', { staticClass: "date-block active" }, [_vm._v(_vm._s(date))]) : date === _vm.plainToday.date && _vm.plainDate.year === _vm.plainToday.year && _vm.plainDate.month === _vm.plainToday.month ? _c('a', { staticClass: "date-block today" }, [_vm._v(_vm._s(date))]) : date ? _c('a', [_vm._v(_vm._s(date))]) : _vm._e()]);
      }));
    }))])]);
  }, staticRenderFns: [],
  props: ['dateValue'],
  computed: {
    dayNames: function dayNames() {
      return DAY_NAMES;
    }
  },
  data: function data() {
    var today = new Date();
    var plainToday = convertPlainDate(today);
    var plainDate = convertPlainDate(today);
    return {
      view: 'days',
      plainToday: plainToday,
      plainDate: plainDate,
      dayRows: []
    };
  },
  created: function created() {
    var d = this.dateValue;
    if (d) {
      this.plainDate = convertPlainDate(d);
    }
    this.resetCells();
  },

  methods: {
    resetCells: function resetCells() {
      fillDayRows(this.plainDate.year, this.plainDate.month, this.dayRows);
    },
    selectCell: function selectCell(date, idx) {
      if (date) {
        var pd = this.plainDate;
        pd.date = date;
        pd.day = DAY_NAMES[idx];
        this.$emit('datechange', new Date(pd.year, pd.month, pd.date));
      }
    },
    go: function go(diffY, diffM) {
      var y = void 0;
      var m = void 0;
      var pd = this.plainDate;
      if (diffY === null) {
        var pt = this.plainToday;
        y = pt.year;
        m = pt.month;
      } else {
        y = pd.year + diffY;
        m = pd.month + diffM;
      }
      var d = pd.date;
      if (m < 0) {
        y--;
        m = 11;
      } else if (m > 11) {
        y++;
        m = 0;
      }
      var max = getMaxDaysOfMonth(y, m);
      if (d > max) {
        d = max;
      }
      var date = new Date(y, m, d);
      this.plainDate = convertPlainDate(date);
      this.resetCells();
    }
  },
  watch: {
    dateValue: function dateValue(v) {
      this.plainDate = convertPlainDate(v);
      this.resetCells();
    }
  }
};

var calendarInput = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "input-group inset-icon dropdown-group" }, [_c('input', { attrs: { "type": "text", "dropdown-action": "toggle", "readonly": "readonly" }, domProps: { "value": _vm.date } }), _c('span', { staticClass: "input-icon icon icon-event" }), _vm._v(" "), _c('my-calendar', { staticClass: "dropdown", attrs: { "date-value": _vm.date }, on: { "datechange": _vm.dateChange } })], 1);
  }, staticRenderFns: [],
  props: ['value'],
  data: function data() {
    return {
      date: ''
    };
  },

  components: {
    'my-calendar': Calendar
  },
  methods: {
    dateChange: function dateChange(date) {
      this.date = formatDate(date);
      this.$emit('datechange', date);
    }
  },
  watch: {
    'value': function value(v) {
      if (v) {
        var pd = convertPlainDate(v);
        var d = new Date(pd.year, pd.month, pd.date);
        this.date = formatDate(d);
      }
    }
  },
  created: function created() {
    var v = this.value;
    if (v) {
      var pd = convertPlainDate(v);
      var d = new Date(pd.year, pd.month, pd.date);
      this.date = formatDate(d);
    }
  }
};



var index = Object.freeze({
	Calendar: Calendar,
	CalendarInput: calendarInput
});

function dispatchCustomEvent(el, eventName, canBubble, cancelable, detail, originalEvent) {
  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(eventName, canBubble, cancelable, detail);
  e.originalEvent = originalEvent;
  var ret = el.dispatchEvent(e);
  if (ret === false && originalEvent) {
    originalEvent.preventDefault();
  }
  return ret;
}

//点击事件名称
var clickEvent = device.isMobile ? 'tap' : 'click';

//用于弹出元素的一些元素、属性名称常量
var POP_ACTION_ATTR = 'popup-action';
var POP_TARGET_ATTR = 'popup-target';
//兼容以前的 dropdown 命名
var DD_ACTION_ATTR = 'dropdown-action';
var DD_TARGET_ATTR = 'dropdown-target';
//兼容以前的 modal 命名
var MODAL_ACTION_ATTR = 'modal-action';
var MODAL_TARGET_ATTR = 'modal-target';

function getAction(el) {
  return el.getAttribute(POP_ACTION_ATTR) || el.getAttribute(DD_ACTION_ATTR) || el.getAttribute(MODAL_ACTION_ATTR);
}

function getTargetSelector(el) {
  return el.getAttribute(POP_TARGET_ATTR) || el.getAttribute(DD_TARGET_ATTR) || el.getAttribute(MODAL_TARGET_ATTR);
}

function isGroupElement(el) {
  var classes = el.classList;
  var attr = el.getAttribute('popup-group');
  return classes.contains('dropdown-group') || classes.contains('popup-group') || attr != null;
}

function queryPopup(parent) {
  return parent.querySelector('.dropdown,.modal-mask,.popup,[popup]') || false;
}

function queryActivePopup() {
  return document.querySelector('.dropdown.active,.popup.active,.active[popup]');
}

//在document对象 click 或 tap 事件中处理弹出相关动作
document.addEventListener(clickEvent, function (event) {
  //需要检查弹出属性的元素
  var el = event.srcElement || event.target;
  //弹出元素
  var popup = void 0;
  //弹出动作
  var action = void 0;
  //查找层级
  var level = 0;
  while (el && el !== document.body && level < 5) {
    action || (action = getAction(el));
    if (el.className.indexOf('modal-mask') >= 0) {
      action || (action = 'close');
      popup = el;
    } else {
      var selector = getTargetSelector(el);
      if (selector) {
        popup = document.querySelector(selector) || false;
        action || (action = 'open');
      } else {
        isGroupElement(el) && (popup = queryPopup(el));
      }
    }
    el = popup || popup === false ? null : el.parentNode;
    level++;
  }
  //获取并隐藏之前弹出的元素
  var last = queryActivePopup();
  if (last && last !== popup) {
    last.classList.remove('active');
  }
  //操作当前组内下拉元素
  if (popup) {
    switch (action) {
      case 'open':
        popup.classList.add('active');
        break;
      case 'toggle':
        popup.classList.toggle('active');
        break;
      case 'close':
        popup.classList.remove('active');
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
var modalOpen = showPopup;
var modalClose = hidePopup;

//点击事件名称
var clickEvent$1 = device.isMobile ? 'tap' : 'click';

//消息对话框
var sysDialog = void 0;
var callbackHandler = void 0;
function createSysDialog() {
  if (sysDialog) return;
  var el = document.createElement('div');
  el.className = 'modal-mask';
  el.innerHTML = '<div class="dialog">' + '<div class="dialog-header"><span></span><a class="dialog-close-btn" modal-action="close"></a></div>' + '<div class="dialog-body"><div class="dialog-message" style="padding: 10px;"></div></div>' + '<div class="dialog-footer">' + '<a class="btn btn-primary btn-ok" modal-action="close">确定</a>' + '<a class="btn btn-outline btn-cancel" modal-action="close">取消</a>' + '</div>' + '</div>';
  document.body.appendChild(el);
  el.addEventListener(clickEvent$1, function (event) {
    if (!callbackHandler) return;
    var eventEl = event.srcElement || event.target;
    var cls = eventEl.classList;
    var act = void 0;
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
  var h = sysDialog.querySelector('.dialog-header>span');
  var btnOk = sysDialog.querySelector('.btn-ok');
  var btnCancel = sysDialog.querySelector('.btn-cancel');
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
var sysMessagePanel = void 0;
var floatTimer = void 0;
function createSysMessagePanel() {
  if (sysMessagePanel) return;
  var el = document.createElement('div');
  el.className = 'float-message';
  document.body.appendChild(el);
  sysMessagePanel = el;
}

function quickMessage(message, type) {
  if (!sysMessagePanel) createSysMessagePanel();
  sysMessagePanel.innerText = message;
  var cls = 'float-message active ' + type;
  sysMessagePanel.className = cls;
  if (floatTimer) clearTimeout(floatTimer);
  floatTimer = setTimeout(function () {
    sysMessagePanel.className = 'float-message';
  }, 2500);
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
