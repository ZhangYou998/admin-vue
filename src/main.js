// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import httpPlugin from '@/assets/js/http'
import ElTreeGrid from 'element-tree-grid'

// 引入公共样式
import './assets/css/style.css'

Vue.use(ElementUI)

// 将 ElTreeGrid 注册为全局组件
Vue.component(ElTreeGrid.name, ElTreeGrid)

// 加载 httpPlugin 插件(封装自 axios)
// 我们在该插件中为 Vue 原型对象扩展了一个成员 $http
// 然后我们就可以在任何组件通过使用 this.$http 来发起请求
Vue.use(httpPlugin)

Vue.config.productionTip = false

// 我们可以为 Vue.prototype 添加成员
// 所有组件都是 Vue 的实例
// 所以说，所有组件 this 都可以访问 Vue.prototype 原型成员
// 给 Vue 原型添加成员，最好给成员名加 $ 前缀
// Vue.prototype.$http =

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
