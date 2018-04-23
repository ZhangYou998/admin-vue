/**
 * 自定义业务函数模块
 * auth.js
 * 封装和用户授权相关函数
 */

const userInfoKey = 'user-info'

/**
 * 保存登录用户信息到本地存储
 * @param  {Object} userInfo 用户登录成功的信息对象
 * @return {undefined}          无返回值
 */
export function saveUserInfo (userInfo = {}) {
  window.localStorage.setItem(userInfoKey, JSON.stringify(userInfo))
}

/**
 * 从本地存储中回去当前登录用户信息
 * @return {string} 当前登录用户信息对象字符串
 */
export function getUserInfo () {
  return window.localStorage.getItem(userInfoKey)
}

/**
 * 获取本地存储中用户信息的 Token 令牌
 * @return {string} 用户的 Token 身份令牌
 */
export function getToken () {
  try {
    // 本地存储中的 user-info 可能不是一个有效的 JSON 格式字符串
    // 为了避免程序出错，使用 try-catcher 来捕获转换失败的异常
    return JSON.parse(getUserInfo()).token
  } catch (err) {
    return ''
  }
}

/**
 * 删除本地存储中的用户登录信息
 * @return {undefined} 无返回值
 */
export function removeUserInfo () {
  window.localStorage.removeItem(userInfoKey)
}
