<template>
  <div class="input-group inset-icon dropdown-group">
    <input type="text" dropdown-action="toggle" readonly :value="date"><span class="input-icon icon icon-event"></span>
    <my-calendar class="dropdown" :date-value="date" v-on:datechange="dateChange"></my-calendar>
  </div>
</template>

<script>
import { formatDate, convertPlainDate } from '../../utils/date.js';
import Calendar from './calendar.vue';

export default {
  props: ['value'],
  data () {
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
</script>
