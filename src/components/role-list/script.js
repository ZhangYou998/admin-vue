export default {
  created () {
    this.loadRoles()
  },
  data () {
    return {
      roleList: [],
      addRoleDialog: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleDialog: false,
      editRightDialog: false,
      editRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      treeData: [],
      treeProps: {
        children: 'children', // 子节点数组名
        label: 'authName' // 节点文本属性名
      },
      treeCheckedKeys: [],
      treeCheckedKeys: null // 迎来存储当前被授权的角色
    }
  },
  methods: {
    async loadRoles () {
      const res = await this.$http.get('/roles')
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.roleList = data
      }
    },

    /**
     * 添加角色
     * 1. 为添加按钮注册点击事件处理函数
     * 2. 弹出添加角色的对话框
     * 3. 布局添加角色对话框
     * 4. 初始化表单对象成员
     *    将表单对象成员绑定到对话框表单中
     * 5. 为确定按钮注册点击事件
     * 6. 获取表单数据
     * 7. 发起添加角色的请求
     * 8. 根据服务器响应数据做交互处理
     */

    async handleAddRole () {
      const res = await this.$http.post('/roles',this.addRoleForm)
      const {data, meta} = res.data
      if (meta.status === 201) {
        this.$message({
          type: 'success',
          message: '添加角色成功'
        })
        // 关闭对话框
        this.addRoleDialog = false
        // 清空添加角色的表单数据
        for (let key in this.addRoleForm) {
          this.addRoleForm[key] = ''
        }
        // 重新加载角色列表
        this.loadRoles()
      }
    },

    /**
     * 删除角色
     * 1. 注册删除按钮的点击事件处理函数
     *    将要删除的角色 id 传递到事件处理函数
     * 2. 弹框提示用户是否删除
     * 3. 拿到删除函数接收到的角色 id
     * 4. 发起请求执行删除操作
     * 5. 根据响应做出交互
     */

    handleRemoveRole (role) {
      this.$confirm('此操作将永久删除该角色，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then (async () => {
        const res = await this.$http.delete(`/roles/${role.id}`)
        const {data, meta} = res.data
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除角色成功'
          })
          // 重新加载角色列表数据
          this.loadRoles()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /**
     * 编辑角色
     * 一：显示编辑弹框，在弹框中加载要编辑的角色信息
     *   1. 为编辑按钮注册点击事件
     *      把要编辑的角色 id 传递到处理函数中
     *   2. 根据角色 id 发起请求，拿到角色的信息
     *   3. 将角色信息绑定输出到表单中进行展示
     * 二：提交表单，完成更新操作
     *   1. 为确定按钮注册点击事件
     *   2. 拿到表单数据
     *   3. 发送请求
     *   4. 根据响应做交互
     */

    async showEditRoleDialog (role) {
      const res = await this.$http.get(`/roles/${role.id}`)
      const {data, meta} = res.data
      if (meta.status === 200) {
        // 把响应的数据赋值给编辑角色表单对象
        this.editRoleForm = data
        // 显示编辑角色对话框
        this.editRoleDialog = true
      }
    },

    /**
     * 编辑角色，处理表单提交
     */

    async handleEditRole () {
      const res = await this.$http.put(`/roles/${this.editRoleForm.roleId}`, this.editRoleForm)
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.$message({
          type: 'success',
          message: '更新角色成功'
        })
        // 重新加载列表数据
        this.loadRoles()
        // 关闭对话框
        this.editRoleDialog = false
      }
    },

    /**
     * 角色授权
     * 业务分析：
     * 1. 点击授权按钮
     *    弹出授权的对话框
     *    在对话框中以树状菜单的方式显示权限列表
     *    把角色已有的权限菜单默认选中
     * 2. 授权操作
     *    用户可以点击权限列表树状才到勾选对应的权限
     *    点击保存按钮，把菜单树中的所有权限授权给该用户
     * 功能实现：
     * 一、展示权限列表，把已有的默认选中
     *
     * 二、
     */

    async showEditRightDialog (role) {
      // 点击授权弹框，保存当前被授权的角色，用来给授权弹框提交表单的时候使用
      this.currentRole = role

      const res = await this.$http.get('/rights/tree')
      const {data, meta} = res.data
      if (meta.status === 200) {
        // 更新权限列表树菜单
        this.treeData = data

        // 找到角色拥有的所有权限的 id
        // 让后赋值给 treeCheckedKeys 让节点默认被选中
        this.treeCheckedKeys = this.getLevel3Ids(role.children)

        // 显示编辑权限对话框
        this.editRightDialog = true
      }
    },
    getLevel3Ids (rightList) {
      // 用来存储三级权限 id 的数组
      const arr = []
      const f = function (rightList) {
        rightList.forEach(function (item) {
          if (!item.children) { // 没有孩子的是最后一级三级节点
            arr.push(item.id)
          } else {
            // 如果有 children 则递归遍历
            f(item.children)
          }
        })
      }
      f(rightList)
      return arr
    },

    /**
     * 处理编辑权限
     */

    async handleEditRights () {
      // 1. 获取菜单树中多有已选中的节点
      const checkedNodes = this.$refs.rightsTree.getCheckedNodes()

      // 获取到的节点对应着权限对象
      //    ↓
      //    1. 拿到所有节点权限的 id
      //    2. 一级所有节点的 父id
      // 我们把所有的权限 id 都放到一个数组中
      // 然后对数组进行去重
      // 数组去重之后，把数组转换成字符串，以 , 分隔

      // 2. 遍历选中的所有权限节点，得到选中的权限 id 以及 父id 拼接为一个字符串
      //    直接拼接字符串
      let ids = ''
      checkedNodes.forEach(item => {
        ids += item.id + ',' + item.pid + ','
      })

      // 3. 对选中的权限 ids 字符串去重
      //    Set 数据结构参考文档：http://es6.ruanyifeng.com/#docs/set-map#Set
      const setRightIds = new Set(ids.split(','))

      // 把 Set 中空字符串内容删除
      setRightIds.delete('')

      // 4. 将 ids 转换为以 , 分隔的字符串
      // 重新将 Set 数组转换成一个以 , 分隔的字符串
      // [...setRightIds] 把 Set 数据结构转成数组
      const rightIds = [...setRightIds].join(',')

      // 5. 发送请求，完成编辑权限操作
      const res = await this.$http.post(`/roles/${this.currentRole.id}/rights`, {
        rids: rightIds
      })

      const {data, meta} = res.data

      if (meta.status === 200) {
        this.loadRoles() // 重新加载角色列表
        this.editRightDialog = false // 关闭授权对话框
        this.$message({ // 提示用户角色权限更新成功
          type: 'success',
          message: '授权成功'
        })
      }
    },

    /**
     * 删除角色指定权限
     * 1. 注册标签的点击关闭事件处理函数
     * 2. 拿到角色 id
     *        权限 id
     * 3. 发送请求执行删除操作
     * 4. 根据响应做交互操作
     */

    async handleRmoveRight (role, right) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${right.id}`)
      const {data, meta} = res.data

      if (meta.status === 200) {

      }
    }
  }
}
