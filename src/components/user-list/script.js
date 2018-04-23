export default {
  async created () {
    this.loadUsersByPage(1)
  },
  data () {
    return {
      searchText: '',
      tableData: [], // 表格列表数据
      totalSize: 0, // 总记录数据
      currentPage: 1, // 当前页码
      pageSize: 5, // 当前每页大小
      userForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      dialogFormVisible: false, // 控制添加用户对话框的显示和隐藏
      dialogEditFormVisible: false, // 控制编辑用户对话框的显示和隐藏
      // 1. 添加 rules 验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      userRoleDialog: false,
      userRoleForm: {
        username: '',
        rid: -1 // 默认 -1 表示没有权限
      },
      roleList: []
    }
  },
  methods: {
    /**
     * 处理分页页码大小改变
     */

    async handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.loadUsersByPage(1, pageSize)

      // 每页大小改变之后，数据回归到了第1页
      // 我们的页码的高亮状态也应用回归到第1页
      // 我们这里就可以使用 this.currentPage 来控制
      this.currentPage = 1
    },

    /**
     * 处理分页页码改变
     */

    async handleCurrentChange (currentPage) {
      this.loadUsersByPage(currentPage)
    },

    /**
     * 处理用户搜索
     */

    handleSearch () {
      this.loadUsersByPage(1)
    },

    /**
     * 分页加载用户列表数据
     */

    async loadUsersByPage (page) {
      const res = await this.$http.get('/users', {
        params: {
          pagenum: page,
          pagesize: this.pageSize,
          query: this.searchText // 根据搜索文本框的内容来搜索
        }
      })
      const {users, total} = res.data.data

      this.tableData = users

      // 把真实的总记录交给分页插件
      // 分页插件会根据总记录数和每页大小自动完成分页效果
      this.totalSize = total
    },

    /**
     * 处理用户状态改变
     * @change="handleStateChange(scope.row)"
     */
    async handleStateChange (user) {
      const {id: userId, mg_state: state} = user
      const res = await this.$http.put(`/users/${userId}/state/${state}`)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: `用户状态${state ? '开启' : '禁用'}成功`
        })
      }
    },

    /**
     * 处理用户状态改变
     * @change="(val) => {handleStateChange(val, scope.row)}"
     */

    // async handleStateChange (state, user) {
    //   const {id: userId} = user
    //   const res = await this.$http.put(`/users/${userId}/state/${state}`)
    //   if (res.data.meta.status === 200) {
    //     this.$message({
    //       type: 'success',
    //       message: `用户状态${state ? '开启' : '禁用'}成功`
    //     })
    //   }
    // },

    /**
     * 处理添加用户
     */

    async handleAddUser () {
      // 1. 获取表单数据
      // 2. 表单验证
      // 3. 发起请求添加用户
      // 4. 根据响应做交互
      //    添加用户成功，给出提示
      //    关闭对话框
      //    重新加载当前列表数据
      this.$refs['addUserForm'].validate(async (valid) => {
        if (!valid) {
          return false
        }
        // 代码执行到这里就表示表单验证通过了，我们可以提交表单了
        const res = await this.$http.post('/users', this.userForm)
        if (res.data.meta.status === 201) {
          // 添加成功提示消息
          this.$message({
            type: 'success',
            message: '添加用户成功'
          })

          // 关闭对话框
          this.dialogFormVisible = false

          // 重新加载用户列表数据
          this.loadUsersByPage(this.currentPage)

          // 清空表单内容
          for (let key in this.userForm) {
            this.userForm[key] = ''
          }
        }
      })
    },

    /**
     * 处理删除用户
     */

    async handleDeleteUser (user) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => { // 点击确认执行该方法
        const res = await this.$http.delete(`/users/${user.id}`)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 删除成功，重新加载列表数据
          this.loadUsersByPage(this.currentPage)
        }
      }).catch(() => { // 点击取消执行该方法
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /**
     * 处理编辑用户
     */
    async handleEditUser () {
      const {id: userId} = this.editUserForm
      const res = await this.$http.put(`/users/${userId}`, this.editUserForm)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '更新用户成功'
        })
        this.dialogEditFormVisible = false // 关闭编辑用户表单对话框
        this.loadUsersByPage(this.currentPage) // 重新加载当前页数据
      }
    },

    /**
     * 处理显示被编辑的用户表单信息
     */
    async handleShowEditForm (user) {
      this.dialogEditFormVisible = true
      const res = await this.$http.get(`/users/${user.id}`)
      this.editUserForm = res.data.data
    },

    /**
     * 《显示分配角色弹框》
     */

    async handleShowRole (user) {
      // 发送请求，拿到用户用户
      // 发送请求，拿到角色列表
      const res = await this.$http.get(`/users/${user.id}`)
      const roleRes = await this.$http.get('/roles')
      const {data, meta} = res.data
      if (meta.status === 200 && roleRes.data.meta.status === 200) {
        this.roleList = roleRes.data.data // 更新角色列表
        this.userRoleForm = data // 更新分配角色表单
        this.userRoleDialog = true // 弹出对话框
      }
    },

    /**
     * 修改用户角色
     */

    async handleEditUserRole () {
      // 得到用户 id 以及当前用户选择的角色 id
      const {id: userId, rid: roleId} = this.userRoleForm
      const res = await this.$http.put(`users/${userId}/role`, {
        rid: roleId
      })
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.$message({
          type: 'success',
          message: '设置角色成功'
        })
        this.userRoleDialog = false // 关闭对话框
      }
    }
  }
}
