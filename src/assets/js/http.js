import axios from 'axios'
import {getToken} from './auth'

// 建议通过定义插件的配置来扩展 Vue 本身
// 1. 定义一个插件对象
const httpPlugin = {}

const http = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/'
})

// 添加请求拦截器
// 拦截器本身就是一个方法
// 该方法什么时候执行？
// 拦截器函数接收一个参数 config
// 当你使用 axios 发起请求的时候，那么就会先经过这和拦截器然后再发出请求
// 也就是说在请求拦截器内部的请求还没有发出去
// 我们可以在这里定制请求之前的行为
http.interceptors.request.use(function (config) {
  // 如果本次请求的不是 /login 接口，则我们就加入请求头
  if (config.url !== '/login') {
    config.headers['Authorization'] = getToken()
  }
  // return config 就好比 next() 允许通过
  // 通过之后才要真正发请求
  return config
}, function (error) { // 当请求出错的时候会调用到第二个参数函数
  return Promise.reject(error)
})

// 2. 为插件对象添加一个成员：install
//    install 是一个函数
//    该函数接收两个参数：Vue、options
httpPlugin.install = function (Vue, options) {
  // 3. 添加实例方法
  Vue.prototype.$http = http
}

// 4. 导出插件对象
export default httpPlugin

// 5. 在入口文件模块加载使插件生效
// Vue.use(thhpPlugin)
