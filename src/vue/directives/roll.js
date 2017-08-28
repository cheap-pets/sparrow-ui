import attachRoll from '../../touch/roll';

const vueRoll = {
  install: function (Vue) {
    Vue.directive('roll', {
      bind: function (el, binding) {
        el.__roll = attachRoll(el, binding.value);
      },
      update: function (el, binding) {
        el.__roll && el.__roll.refreshSize();
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
