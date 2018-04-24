import {http} from '../assets/js/http'
// 使用 webpack 打包的代码，某些模块 Node 模块在浏览器中可以使用，例如 path 模块
// import path from 'path'
// M Model
//    在服务器 Model 就是和数据库交互的
//    在客户端 Model 就是和服务器接口数据交互的
//    Model 其实就是一个类
//    Model 和 View 没有关系
//    类就是模型、模板的意思
// V View 视图、html
// VM 操作视图的数据

const baseUrl = '/categories'

export default class Category {
  constructor (c) {
    this.cat_pid = c.cat_pid
    this.cat_name = c.cat_name
    this.cat_level = c.cat_level
  }

  // 实例成员，只能被实例调用
  save () {
    return http.post(baseUrl, this)
  }

  // 静态成员，只能被类调用
  static findByType (condition) {
    return http.get(baseUrl, {
      params: {
        type: condition.type,
        pagenum: condition.pagenum,
        pagesize: condition.pagesize
      }
    })
  }

  static findById (id) {
    return http.get(`${baseUrl}/${id}`)
  }

  static updateById (id, category) {
    return http.put(`${baseUrl}/${id}`, {
      cat_name: category.cat_name
    })
  }

  static deleteById (id) {
    return http.delete(`${baseUrl}/${id}`)
  }
}
