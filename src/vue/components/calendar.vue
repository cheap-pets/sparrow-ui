<template>
  <div class="calendar">
    <div class="calendar-header">
      <span>{{plainDate.year}} 年</span>
      <p>{{plainDate.month+1}} 月 {{plainDate.date}} 日， 星期{{plainDate.day}}</p>
    </div>
    <div class="bar bar-menu bar-tab">
      <a class="btn btn-link" @tap="go(-1, 0)">上一年</a>
      <a class="btn btn-link" @tap="go(0, -1)">上一月</a>
      <a class="btn btn-link" @tap="go(null)">本月</a>
      <a class="btn btn-link" @tap="go(0, 1)">下一月</a>
      <a class="btn btn-link" @tap="go(1, 0)">下一年</a>
    </div>
    <table class="calendar-body">
      <thead>
        <th v-for="(n, index) in dayNames" :key="index">{{n}}</th>
      </thead>
      <tbody>
        <tr v-for="(row, index) in dayRows" :key="index">
          <td v-for="(date, idx) in row" :key="idx" @tap="selectCell(date, idx)">
            <a v-if="date === plainDate.date" class="date-block active">{{date}}</a>
            <a v-else-if="date === plainToday.date && plainDate.year === plainToday.year && plainDate.month === plainToday.month" class="date-block today">{{date}}</a>
            <a v-else-if="date">{{date}}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { dateOptions, getMaxDaysOfMonth, convertPlainDate } from '../../utils/date.js';
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
  let firstDay = (new Date(year, month, 1)).getDay();

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

export default {
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
</script>
