import CategoryCasCader from '@/common/category-cascader'

export default {
  created () {},
  data () {
    return {
      tableData: [],
      inputText: '',
      currentCategoryId: 0,
      addManyDialog: false,
      addManyForm: {
        attr_name: '',
        attr_sel: 'many'
      }
    }
  },
  methods: {
    async handleInputConfirm (param, e) {
      // 拿到当前输入框的值
      // 拿到要修改的参数对象
      // 把输入框的值拼接到参数对象的 attr_vals 中（注意：以逗号分隔）
      // 发起请求做编辑处理

      // 如果用户输入的内容为空，则什么都不做
      if (e.target.value.length === 0) {
        console.log('要吗数据是空的会进来，要吗 enter 之后也 blur了有就进来了')
        param.inputVisible = false
        return
      }

      // 处理定制标签字符串
      param.attr_vals += `,${e.target.value}`

      // 发请求，执行更新操作
      const res = await this.$http.put(`/categories/${this.currentCategoryId}/attributes/${param.attr_id}`, param)

      const {data, meta} = res.data
      if (meta.status === 200) {
        param.inputVisible = false // 隐藏标签文本框
        this.$message({
          type: 'success',
          message: '更新分类参数标签成功'
        })
        e.target.value = '' // 清空文本框
      }
    },

    // row 就是当前行
    showInput (row) {
      // 让当前行的 inputVisible 显示出来
      row.inputVisible = true

      // 让文本框聚焦的
      this.$nextTick(() => {
        // 让 input 聚焦
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleChange (val) {
      this.currentCategoryId = val[2]
      this.loadManyParams()
    },

    /**
     * 添加动态分类参数
     */

    async handleAddMany () {
      const res = await this.$http.post(`categories/${this.currentCategoryId}/attributes`, this.addManyForm)
      const {data, meta} = res.data
      if (meta.status === 201) {
        this.$message({
          type: 'success',
          message: '添加动态分类参数成功'
        })
        this.addManyDialog = false // 取消显示对话框
        this.addManyForm.attr_name = '' // 清空表单数据
        this.loadManyParams()
      }
    },

    /**
     * 点击显示添加动态分类参数对话框
     */

    showAddManyDialog () {
      this.currentCategoryId === 0 ?
        this.$message({
          message: '请选择分类',
          type: 'warning'
        })
        : this.addManyDialog = true
    },

    async loadManyParams () {
      const res = await this.$http.get(`/categories/${this.currentCategoryId}/attributes`, {
        params: {
          sel: 'many'
        }
      })
      const {data, meta} = res.data
      if (meta.status === 200) {

        // 将以 , 分隔的字符串都分隔成数据
        data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })

        this.tableData = data

        // 动态的为 tableData 的每一行增加 inputVisible 属性
        this.tableData.forEach(item => {
          this.$set(item, 'inputVisible', false)
        })
      }
    },

    /**
     * 删除标签 tag 的处理方法
     */

    async handleDeleteTag (row, index) {
      // 将数据从视图中移除，视图完成更新
      row.attr_vals.splice(index, 1)

      // 发请求，执行更新操作
      const res = await this.$http.put(`/categories/${this.currentCategoryId}/attributes/${row.attr_id}`, {
        ...row, // 对象拷贝，也叫混入
        attr_vals: row.attr_vals.join(',') // 这里的 attr_vals 正好把 row.attr_vals 覆盖掉
      })

      const {data, meta} = res.data

      if (meta.status === 200) {
        this.$message({
          type: 'success',
          message: '更新分类参数标签成功'
        })
      }
    }

  },
  components: {
    CategoryCasCader
  }
}
