import CategoryCasCader from '@/common/category-cascader'

export default {
  created () {},
  data () {
    return {
      tableData: [],
      inputVisible: false,
      inputText: '',
      currentCategoryId: 0
    }
  },
  methods: {
    async handleInputConfirm (param, e) {
      // 拿到当前输入框的值
      // 拿到要修改的参数对象
      // 把输入框的值拼接到参数对象的 attr_vals 中(注意:以逗号分隔)
      // 发起请求做编辑处理

      // 如果用户输入的内容为空，则什么都不做
      if (e.target.value.length === 0) {
        console.log('要么数据是空的会进来，要么 enter 之后也 blur 了有就进来了')
        param.inputVisible = false
        return
      }

      // 处理定制标签字符串
      param.attr_vals += `,${e.target.value}`

      // 发请求，执行更新操作
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
      // this.$nextTick(_ => {
      //   // 让 input 聚焦
      //   this.$refs.saveTagInput.$refs.input.focus()
      // })
    },

    async handleChange (val) {
      const categoryId = this.currentCategoryId = val[2]
      const res = await this.$http.get(`/categories/${categoryId}/attributes`, {
        params: {
          sel: 'many'
        }
      })
      const {data, meta} = res.data
      if (meta.stauts === 200) {
        this.tableData = data
        // 动态的为 tableDate 的每一行增加 inputVisible 属性
        this.tableDate.forEach(item => {
          this.$set(item, 'inputVisible', false)
        })
      }
    }
  },
  components: {
    CategoryCasCader
  }
}
