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
      pageSize: 3, // 当前每页大小
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
      addUserFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入电话', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 当我们点击切换每页大小的时候，分页组件就会触发执行 handleSizeChange 方法
    // 我们要做的就是在这里拿到用户选择的每页大小，重新发起新的数据请求
    async handleSizeChange (pageSize) {
      // 将用户选择的页码大小存储起来
      // 用于页码改变之后，再次点击页码的时候获取最新用户选择的每页大小
      this.pageSize = pageSize
      // 页码发生改变 重新请求列表数据
      // 用户改变每页大小之后，我们请求新的数据，以新的每页大小的第1页为准
      this.loadUsersByPage(1, pageSize)

      // 页码改变之后，不仅让数据到了第1页，同时也要让页码高亮状态跑到第1页
      this.currentPage = 1
    },
    // 当你点击分页组件的页码发生变化的时候，会自动触发调用 handleCurrentChange 方法
    // 我们要做的就是在这个方法中调用 loadUsersByPage(当前页码)
    async handleCurrentChange (currentPage) {
      // 拿到当前最新的每页大小
      this.loadUsersByPage(currentPage)
    },
    handleSwarch () {
      this.loadUsersByPage(1)
    },
    // 根据页码加载用户列表数据
    async loadUsersByPage (page) {
      const res = await this.$http.get('/users', {
        params: { // 请求参数，对象会被转换为 k=v&k=v 的格式，然后拼接到请求路径 ? 后面发起请求
          pagenum: page,
          pagesize: this.pageSize,
          query: this.searchText // 更具搜索文本框的内容来搜索
        }
      })

      const {users, total} = res.data.data

      this.tableData = users
      this.totalSize = total
    },
    async handleAddUser () {
      // 1. 获取表单数据
      // 2. 变淡验证
      // 3. 发起请求添加用户
      // 4. 根据响应做交互
      //    添加用户成功，给出提示
      //    关闭对话框
      //    重新加载当前列表数据
      this.$refs['addUserForm'].validate(async (valib) => {
        if (!valib) {
          return false
        }
        // 代码执行到这里就表示表单验证通过了，我们可以提交表单了
        const res = await this.$http.post('/users', this.userForm)
        if (res.data.meta.status === 201) {
          // 添加成功提示消息
          this.$message({
            type: 'success',
            message: '添加成功'
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
    async handleDeleteUser (user) {
      this.$confirm('此操作将永久删除该用户，是否继续?', '提示', {
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
    async handleEditUser () {
      const {id: userId} = this.editUserForm
      const res = await this.$http.put(`/users/${userId}`, this.editUserForm)
      if (res.date.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '更新用户成功'
        })
        this.dialogEditFormVisible = false // 关闭编辑用户表单对话框
        this.loadUsersByPage(this.currentPage) // 重新加载当前页面数据
      }
    },
    async handleShowEditForm (user) {
      this.dialogEditFormVisible = true
      const res = await this.$http.get(`/users/${user.id}`)
      this.editUserForm = res.data.data
    }
  }
}