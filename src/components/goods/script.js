export default {
  created () {
    this.loadGoods(1)
  },
  data () {
    return {
      tableData: [],
      currentPage: 1,
      totalSize: 0,
      pageSize: 10
    }
  },
  methods: {
    async loadGoods (page) {
      const res = await this.$http.get('/goods', {
        params: {
          pagenum: page,
          pagesize: this.pageSize
        }
      })
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.totalSize = data.total
        this.tableData = data.goods
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.loadGoods(1)
      this.currentPage = 1
    },
    handleCurrentChange (val) {
      this.loadGoods(val)
    }
  }
}
