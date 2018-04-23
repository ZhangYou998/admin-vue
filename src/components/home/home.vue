<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="./logo.png" alt="">
          </div>
        </el-col>
        <el-col :offset="16" :span="4"><div class="grid-content bg-purple">
          <a
            href="#"
            @click.prevent="logout">退出</a>
        </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="container">
      <el-aside class="aside" width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo aside-menu"
          @open="handleOpen"
          @close="handleClose"
          :unique-opened="true"
          :router="true">
          <el-submenu
            v-for="level1Menu in menuList"
            :index="level1Menu.path"
            :key="level1Menu.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <!-- 一级菜单的名称 -->
              <span>{{ level1Menu.authName }}</span>
            </template>
            <el-menu-item
              v-for="level2Menu in level1Menu.children"
              :index="level2Menu.path"
              :key="level2Menu.id">{{ level2Menu.authName }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {removeUserInfo} from '@/assets/js/auth'

export default {
  created () {
    // 动态加载用户的角色对应的权限菜单数据
    this.loadMenus()
  },
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    logout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确认执行 resolve 函数
        // 1. 删除本地存储中的用户登录信息
        removeUserInfo()
        // 2. 跳转到登录视图
        this.$router.push({
          name: 'login'
        })
        // 提示用户退出成功
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        // 点击取消的操作
      })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    async loadMenus () {
      // 动态的获取左侧菜单栏数据
      const res = await this.$http.get('/menus')
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.menuList = data
      }
    }
  }
}
</script>

<style>
.container, .aside .aside-menu {
  height: 100%;
}
.header {
  background-color: #B3C0D1;
  line-height: 60px;
}
.aside {
  background-color: #D3DCE6;
}
.main {
  background-color: #E9EEF3;
  height: 100%;
}
</style>
