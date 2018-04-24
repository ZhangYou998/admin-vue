<template>
  <el-cascader
    :options="options"
    :props="{value: 'cat_id', label: 'cat_name'}"
    @change="handleChange">
  </el-cascader>
</template>

<script>
import Category from '@/api/category'

export default {
  created () {
    this.loadOptions()
  },
  props: {
    level: {
      type: [String, Number],
      default: 3
    }
  },
  data () {
    return {
      options: []
    }
  },
  methods: {
    async loadOptions () {
      const res = await Category.findAll(this.level)
      const {data, meta} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },

    handleChange (val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style>
</style>
