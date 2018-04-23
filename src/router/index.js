import Vue from 'vue'
import Router from 'vue-router'
import {getUserInfo} from '@/assets/js/auth'

import Login from '@/components/login/login'// @ 是 src 路径的别名, webpack 配置的
import Home from '@/components/home/home'

// 用户管理组件
import UserList from '@/components/user-list/user-list'

// 角色管理组件
import RoleList from '@/components/role-list/role-list'

// 权限列表组件
import RightsList from '@/components/rights-list/rights-list'

// 分类列表组件
import CategoryList from '@/components/category-list/category-list'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home', // home 组件会渲染到 App.vue 跟组件 router-view 中
      path: '/',
      component: Home,
      // 我们可以通过配置子路由的方式让某个组件渲染到父路由组件
      // 1. 在父路由组件中添加 <router-view></router-view> 标记
      // 2. 在父路由组件中通过 children 来声明子路由
      //    children 是一个数组
      //    children 数组中配置一个子路由对象
      // 当你访问 user-list 组件的时候，路由会先渲染它的父路由组件
      // 然后将 user-list 组件渲染到父路由的 router-view 标记中
      children: [
        {
          name: 'user-list',
          path: '/users',
          component: UserList
        },
        {
          name: 'role-list',
          path: '/roles',
          component: RoleList
        },
        {
          name: 'rights-list',
          path: '/rights',
          component: RightsList
        },
        {
          name: 'category-list',
          path: '/categories',
          component: CategoryList
        }
      ]
    }
  ]
})

// 1. 添加路由拦截器(导航钩子，守卫)
//    接下来所有的视图导航都必须过这道关卡
//    一旦进入就得好俗路由守卫
//    to 去哪里
//    from 从哪里来
//    next 用来放行
router.beforeEach((to, from, next) => {
  // 2.
  // 拿到当前请求的视图路径标识
  // 2.1 如果是登录组件，则直接放行通过
  // 2.2 如果是非登录组件，则检查 token 令牌
  //    2.2.1 有令牌就过去
  //    2.2.2 无令牌，则让其登录去
  if (to.name === 'login') {
    next()
  } else {
    // 检查是否具有当前登录的用户信息状态
    if (!getUserInfo()) { // 无令牌，则让其登录去
      next({
        name: 'login'
      })
    } else { // 有令牌就通过
      next()
    }
  }
})

export default router
