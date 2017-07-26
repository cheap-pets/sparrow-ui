(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.sparrow = global.sparrow || {})));
}(this, (function (exports) {

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

var platform = isWindows ? 'windows' : (isAndroid ? 'android' : (isIos ? 'ios' : 'unknow'));

if (isMobile) {
  window.document.documentElement.classList.add('mobile');
}

function orientation() {
  return ((window.innerHeight / window.innerWidth) < 1) ? 'landscape' : 'portrait';
}

var mediaQuery = {
  platform: platform,
  mobile: isMobile,
  iphone: isIphone,
  ipad: isIpad,
  ipod: isIpod,
  androidPhone: isAndroidPhone,
  windowsPhone: isWindowsPhone,
  orientation: orientation
};

//impl "requestAnimationFrame" & “cancelAnimationFrame” if not exist.

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame;

window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame;

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(fn) {
    return window.setTimeout(fn, 100 / 6);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(h) {
    clearTimeout(h);
  };
}

var MAX_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var dateOptions = {
  DAY_SHORT_NAMES: ['日', '一', '二', '三', '四', '五', '六']
};

function isLeapMonth(year, month) {
  return month === 1 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
}

//examples: getMaxDaysOfMonth(2017, 7) => 31
function getMaxDaysOfMonth(year, month) {
  return isLeapMonth(year, month) ? 29 : MAX_DAYS[month];
}

//example: formatDate(date, 'yyyy-MM-dd hh:mm:ss.SSS');
function formatDate (date, format) {
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
      var v = (void 0);
      if (RegExp.$1.length === 2) {
        v = ('00' + o[k]).substr(('' + o[k]).length);
      } else if (RegExp.$1.length === 3) {
        v = ('000' + o[k]).substr(('' + o[k]).length);
      } else { v = o[k]; }
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
  var firstDay = (new Date(year, month, 1)).getDay();

  var n = 1;
  for (var i$1 = 0; i$1 < 6; i$1++) {
    for (var j$1 = 0; j$1 < 7; j$1++) {
      if ((i$1 !== 0 || j$1 >= firstDay) && n <= maxDays) {
        if (rows[i$1].$set) {
          rows[i$1].$set(j$1, n);
        } else {
          rows[i$1][j$1] = n;
        }
        n++;
      } else {
        if (rows[i$1].$set) {
          rows[i$1].$set(j$1, null);
        } else {
          rows[i$1][j$1] = null;
        }
      }
    }
  }
}

var Calendar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"calendar"},[_c('div',{staticClass:"calendar-header"},[_c('span',[_vm._v(_vm._s(_vm.plainDate.year)+" 年")]),_c('p',[_vm._v(_vm._s(_vm.plainDate.month+1)+" 月 "+_vm._s(_vm.plainDate.date)+" 日， 星期"+_vm._s(_vm.plainDate.day))])]),_c('div',{staticClass:"bar bar-menu bar-tab"},[_c('a',{staticClass:"btn btn-link",on:{"tap":function($event){_vm.go(-1, 0);}}},[_vm._v("上一年")]),_vm._v(" "),_c('a',{staticClass:"btn btn-link",on:{"tap":function($event){_vm.go(0, -1);}}},[_vm._v("上一月")]),_vm._v(" "),_c('a',{staticClass:"btn btn-link",on:{"tap":function($event){_vm.go(null);}}},[_vm._v("本月")]),_vm._v(" "),_c('a',{staticClass:"btn btn-link",on:{"tap":function($event){_vm.go(0, 1);}}},[_vm._v("下一月")]),_vm._v(" "),_c('a',{staticClass:"btn btn-link",on:{"tap":function($event){_vm.go(1, 0);}}},[_vm._v("下一年")])]),_c('table',{staticClass:"calendar-body"},[_c('thead',_vm._l((_vm.dayNames),function(n,index){return _c('th',{key:index},[_vm._v(_vm._s(n))])})),_c('tbody',_vm._l((_vm.dayRows),function(row,index){return _c('tr',{key:index},_vm._l((row),function(date,idx){return _c('td',{key:idx,on:{"tap":function($event){_vm.selectCell(date, idx);}}},[(date === _vm.plainDate.date)?_c('a',{staticClass:"date-block active"},[_vm._v(_vm._s(date))]):(date === _vm.plainToday.date && _vm.plainDate.year === _vm.plainToday.year && _vm.plainDate.month === _vm.plainToday.month)?_c('a',{staticClass:"date-block today"},[_vm._v(_vm._s(date))]):(date)?_c('a',[_vm._v(_vm._s(date))]):_vm._e()])}))}))])])},staticRenderFns: [],
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
    plainDate.date = 20;
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
      var y;
      var m;
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
    'dateValue': function (v) {
      this.plainDate = convertPlainDate(v);
      this.resetCells();
    }
  }
};

var calendarInput = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"input-group inset-icon dropdown-group"},[_c('input',{attrs:{"type":"text","dropdown-action":"toggle","readonly":"readonly"},domProps:{"value":_vm.date}}),_c('span',{staticClass:"input-icon icon icon-event"}),_c('my-calendar',{staticClass:"dropdown",attrs:{"date-value":_vm.date},on:{"datechange":_vm.dateChange}})],1)},staticRenderFns: [],
  props: ['value'],
  data: function data () {
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
    'value': function (v) {
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

function dispatchCustomEvent (el, eventName, canBubble, cancelable, detail) {
  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(eventName, canBubble, cancelable, detail);
  return el.dispatchEvent(e);
}

function addElement (parentNode, tagName, attributes, innerHTML) {
  var el = document.createElement(tagName);
  if (attributes) {
    for (var a in attributes) {
      if (a === 'style') {
        for (var s in attributes.style) {
          el.style[s] = attributes.style[s];
        }
      } else { el[a] = attributes[a]; }
    }
  }
  if (innerHTML) { el.innerHTML = innerHTML; }
  parentNode.appendChild(el);
  return el;
}

function isInput (el) {
  var tag = el ? el.tagName.toLowerCase() : null;
  return tag === 'input' || tag === 'textarea';
}

function getActiveInput (parentEl) {
  var actEl = document.activeElement;
  var isInputActive = isInput(actEl);
  var el;
  if (isInputActive) {
    if (parentEl) {
      var p = actEl.parentNode;
      while (p && p !== document.body) {
        if (p === parentEl) {
          el = actEl;
          break;
        }
        p = p.parentNode;
      }
    } else { el = actEl; }
  }
  return el;
}

function setTransitionDuration (el, s) {
  el.style.webkitTransitionDuration = s + 's';
}

function getTransformY (el) {
  var s = el.style.transform || el.style.webkitTransform || '';
  var t = s.match(/translate3d\(\dpx,([^)]*)/);
  var v = t ? t[1] : 0;
  return parseInt(v, 10);
}

function setTransformY (el, y) {
  el.style.webkitTransform = 'translate3d(0,' + y + 'px,0)';
}

function attachRoll(wEl, option) {
  var stage, x, y, minY, transY, releaseY;
  var el, hEl, fEl, sbEl, wh, h, hh, fh, hy, fy;
  var ts, speed, direction;
  var moveTimer, spdTimer, itlTimer;

  //prepare dom
  wEl.style.overflow = 'hidden';
  for (var i = 0; i < wEl.children.length; i++) {
    var n = wEl.children[i];
    if (n.classList.contains('roll-body')) { el = n; }
    else if (n.classList.contains('roll-header')) { hEl = n; }
    else if (n.classList.contains('roll-footer')) { fEl = n; }
  }
  if (!el) { el = wEl.children[0]; }
  el.style.webkitTransition = 'transform 0s ease-in';

  function refreshSize() {
    wh = wEl.clientHeight;
    h = el.offsetHeight;
    minY = wh - h;
    if (minY > 0) { minY = 0; }
  }

  function calcDirection(y) {
    return y > 0 ? 1 : y < 0 ? -1 : 0;
  }

  function dispatchEvent$$1(eventName, e) {
    var detail = {
      y: transY,
      minimumY: minY,
      releaseY: releaseY,
      direction: direction
    };
    if (e) { detail.srcEvent = e; }
    return dispatchCustomEvent(wEl, eventName, false, false, detail);
  }

  function setHeaderFooterState(y, final) {
    var hy0 = 0;
    var fy0 = 0;
    function activate(el) {
      el.classList.add('active');
      setTimeout(function() {
        el.classList.remove('active');
        setTransformY(el, 0);
        //el.style.opacity = 0;
      }, 1000);
    }
    if (final) {
      if (hy === hh) {
        hy0 = hy;
        activate(hEl);
        dispatchEvent$$1('rollheaderactivate');
      } else if (fy === -fh) {
        fy0 = fy;
        activate(fEl);
        dispatchEvent$$1('rollfooteractivate');
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
    if (h <= wh || !option.scrollbar) { return; }
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
    if (h <= wh || !sbEl) { return; }
    sbEl.style.top = -transY * (wh / h) + 'px';
  }

  window.addEventListener('resize', function(e) {
    var newY = null;
    var iptEl = getActiveInput(el);
    refreshSize();
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
  });

  el.addEventListener('touchstart', function(e) {
    stage = 0;
    var iptEl = getActiveInput();
    if (iptEl && iptEl !== e.target) {
      isInput(e.target) ? e.target.focus() : iptEl.blur();
      e.preventDefault();
      return;
    }
    clearTimeout(spdTimer);
    cancelAnimationFrame(itlTimer);
    stage = 1;
    var t = e.touches[0];
    x = t.pageX;
    y = t.pageY;
    ts = +new Date();
  });

  el.addEventListener('touchmove', function(e) {
    var t = e.changedTouches[0];
    var deltaY = y - t.pageY;
    if (stage === 1) {
      if (Math.abs(x - t.pageX) > 10) {
        stage = 0;
      } else if (Math.abs(deltaY) > 10) {
        releaseY = transY = getTransformY(this);
        refreshSize();
        if (dispatchEvent$$1('rollstart', e) === false) { return; }
        stage = 2;
        initScrollbar();
        setTransitionDuration(this, 0);
      }
    }
    if (stage === 2) {
      var tsNow = +new Date();
      speed = deltaY / (tsNow - ts);
      clearTimeout(spdTimer);
      spdTimer = setTimeout(function() {
        speed = 0;
      }, 50);
      if (transY > 0 || transY < minY) { deltaY = deltaY * 0.5; }
      releaseY = transY = transY - deltaY;
      ts = tsNow;
      y = t.pageY;
      doMove(transY);
      setScrollPos();
      direction = calcDirection(deltaY);
      dispatchEvent$$1('rollmove', e);
      e.preventDefault();
      e.stopPropagation();
    }
  });

  el.addEventListener('touchend', function(e) {
    var isOut;
    function dockIn () {
      transY = transY > 0 ? 0 : minY;
      setTransitionDuration(el, 0.3);
      doMove(transY, true);
      if (sbEl) { sbEl.style.display = 'none'; }
      dispatchEvent$$1('rollend', e);
    }

    function outOfRange () {
      return transY > 0 || transY < minY;
    }

    function inertialMove() {
      var tsNow = +new Date();
      var deltaY = speed * (tsNow - ts);
      ts = tsNow;
      transY -= deltaY;
      isOut = isOut || outOfRange();
      setTransformY(el, transY);
      setScrollPos();
      dispatchEvent$$1('rollmove', e);
      if (Math.abs(speed) > 0.01) {
        speed = speed * (isOut ? 0.5 : 0.95);
        itlTimer = requestAnimationFrame(inertialMove);
      } else {
        isOut ? dockIn() : dispatchEvent$$1('rollend', e);
      }
    }

    if (stage === 2) {
      clearTimeout(spdTimer);
      e.preventDefault();
      e.stopPropagation();
      if (outOfRange()) { dockIn(); }
      else {
        if (speed > 5) { speed = 5; }
        else if (speed < -5) { speed = -5; }
        itlTimer = requestAnimationFrame(inertialMove);
      }
    }
    stage = 0;
  });
}

var vueRoll = {
  install: function (Vue) {
    Vue.directive('roll', {
      bind: function (el, binding) {
        attachRoll(el, binding.value);
      }
    });
  }
};

if (window.Vue) {
  Vue.use(vueRoll);
}



var index = Object.freeze({
	Calendar: Calendar,
	CalendarInput: calendarInput
});

var touchable = ('ontouchend' in document);

if (touchable) {
  var isTap, x, y, ts;
  document.addEventListener('touchstart', function(e) {
    //let tag = e.target.tagName.toLowerCase();
    //if (tag === 'input' || tag === 'textarea') return;
    isTap = true;
    var t = e.touches[0];
    x = t.pageX;
    y = t.pageY;
    ts = +new Date();
  });
  document.addEventListener('touchmove', function(e) {
    if (isTap) {
      var t = e.changedTouches[0];
      if (Math.abs(x - t.pageX) > 10 || Math.abs(y - t.pageY) > 10) {
        isTap = false;
      }
    }
  });
  document.addEventListener('touchend', function(e) {
    var ms = +new Date() - ts;
    if (isTap && ms < 500) {
      //let tag = e.target.tagName.toLowerCase();
      //let canBubble = (tag !== 'input' && tag !== 'textarea');
      dispatchCustomEvent(e.target, 'tap', true, true, e);
    }
    isTap = false;
  });
} else {
  document.addEventListener('click', function(e) {
    dispatchCustomEvent(e.target, 'tap', true, true, e);
  });
}

//点击事件名称
var clickEvent = touchable ? 'tap' : 'click';

//用于弹出元素的一些元素、属性名称常量
var POP_ACTION_ATTR = 'popup-action';
var POP_TARGET_ATTR = 'popup-target';
//兼容以前的 dropdown 命名
var DD_ACTION_ATTR = 'dropdown-action';
var DD_TARGET_ATTR = 'dropdown-target';
//兼容以前的 modal 命名
var MODAL_ACTION_ATTR = 'modal-action';
var MODAL_TARGET_ATTR = 'modal-target';

function findAction(el) {
  return el.getAttribute(POP_ACTION_ATTR) || el.getAttribute(DD_ACTION_ATTR) || el.getAttribute(MODAL_ACTION_ATTR);
}

function findTarget(el) {
  return el.getAttribute(POP_TARGET_ATTR) || el.getAttribute(DD_TARGET_ATTR) || el.getAttribute(MODAL_TARGET_ATTR);
}

function findPopupElement(parent) {
  return parent.querySelector('.dropdown,.modal-mask,.popup,[popup]');
}

function isGroupElement(el) {
  var cls = el.className;
  var attr = el.getAttribute('popup-group');
  return cls.indexOf('dropdown-group') >= 0 || cls.indexOf('popup-group') >= 0 || (attr !== null && attr !== undefined);
}

function isMaskElement(el) {
  return el.className && el.className.indexOf('modal-mask') >= 0;
}

//在document对象 click 或 tap 事件中处理弹出相关动作
document.addEventListener(clickEvent, function(event) {
  //触发事件的元素
  var srcElement = event.srcElement || event.target;
  var popupElement;
  //表示点击在空白区域
  var isMask = isMaskElement(srcElement);
  //获取指定动作
  var action = findAction(srcElement);
  if (action === 'none') {
    return;
  } else if (isMask) {
    popupElement = srcElement;
    action = 'close';
  }
  if (!isMask) {
    var target = action ? findTarget(srcElement) : undefined;

    //查找组元素（最多找5层）
    var seek = (srcElement === document.body) ? srcElement : srcElement.parentNode;
    var groupElement;
    var count = 0;
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
    var lastElement = document.querySelector('.dropdown.active,.popup.active,.active[popup]');
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
var modalOpen = showPopup;
var modalClose = hidePopup;

//点击事件名称
var clickEvent$1 = touchable ? 'tap' : 'click';

//消息对话框
var sysDialog;
var callbackHandler;
function createSysDialog() {
  if (sysDialog) { return; }
  var el = document.createElement('div');
  el.className = 'modal-mask';
  el.innerHTML = '<div class="dialog">' +
    '<div class="dialog-header"><span></span><a class="dialog-close-btn" modal-action="close"></a></div>' +
    '<div class="dialog-body"><div class="dialog-message" style="padding: 10px;"></div></div>' +
    '<div class="dialog-footer">' +
    '<a class="btn btn-primary btn-ok" modal-action="close">确定</a>' +
    '<a class="btn btn-link btn-cancel" modal-action="close">取消</a>' +
    '</div>' +
    '</div>';
  document.body.appendChild(el);
  el.addEventListener(clickEvent$1, function (event) {
    if (!callbackHandler) { return; }
    var eventEl = event.srcElement || event.target;
    var cls = eventEl.classList;
    var act;
    if (cls.contains('modal-mask') || cls.contains('btn-cancel') || cls.contains('dialog-close-btn')) {
      act = 'cancel';
    } else if (cls.contains('btn-ok')) {
      act = 'ok';
    }
    if (act) { callbackHandler(act); }
  });
  sysDialog = el;
}

function showDialog(messageType, message, callback) {
  if (!sysDialog) { createSysDialog(); }
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
var sysMessagePanel;
var floatTimer;
function createSysMessagePanel() {
  if (sysMessagePanel) { return; }
  var el = document.createElement('div');
  el.className = 'float-message';
  document.body.appendChild(el);
  sysMessagePanel = el;
}

function quickMessage(message, type) {
  if (!sysMessagePanel) { createSysMessagePanel(); }
  sysMessagePanel.innerText = message;
  var cls = 'float-message active ';
  cls += (type === 'success') ? 'bg-success' : (type === 'warn' ? 'bg-negative' : 'bg-primary');
  sysMessagePanel.className = cls;
  if (floatTimer) { clearTimeout(floatTimer); }
  floatTimer = setTimeout(function () {
    sysMessagePanel.className = 'float-message';
  }, 3000);
}

if (document.body) {
  createSysDialog();
  createSysMessagePanel();
} else {
  window.addEventListener('load', function() {
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

exports.media = mediaQuery;
exports.vue = index;
exports.dateOptions = dateOptions;
exports.isLeapMonth = isLeapMonth;
exports.getMaxDaysOfMonth = getMaxDaysOfMonth;
exports.formatDate = formatDate;
exports.convertPlainDate = convertPlainDate;
exports.attachRoll = attachRoll;
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
