const MAX_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export let dateOptions = {
  DAY_SHORT_NAMES: ['日', '一', '二', '三', '四', '五', '六']
};

export function isLeapMonth(year, month) {
  return month === 1 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
}

//examples: getMaxDaysOfMonth(2017, 7) => 31
export function getMaxDaysOfMonth(year, month) {
  return isLeapMonth(year, month) ? 29 : MAX_DAYS[month];
}

//example: formatDate(date, 'yyyy-MM-dd hh:mm:ss.SSS');
export function formatDate (date, format) {
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

export function convertPlainDate(date) {
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
