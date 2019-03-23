// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import fastclick from 'fastclick';
import './common/js/rem.js';
import 'babel-polyfill';
import './common/style/index.styl';
import 'font-awesome/css/font-awesome.min.css';
import './vant.js'

Vue.config.productionTip = false;
// 移动端点击300毫秒延迟
fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
