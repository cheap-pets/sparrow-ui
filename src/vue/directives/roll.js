import attachRoll from '../../touch/roll';

const vueRoll = {
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

export {
  vueRoll
};
