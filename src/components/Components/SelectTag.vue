<template>
  <el-select
    v-model="innerValue"
    :remote-method="remoteMethod"
    :loading="loading"
    :multiple-limit="5"
    v-bind="$attrs"
    multiple
    filterable
    allow-create
    remote
    reserve-keyword
    placeholder="请输入关键词"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :value="item.value"
    >
      {{ item.label }}
    </el-option>
  </el-select>
</template>

<script>
import { getTags } from '@/api/tag'
export default {
  name: 'SelectTag',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      options: [],
      innerValue: this.value
    }
  },
  watch: {
    innerValue(value) {
      this.$emit('input', value)
    }
  },
  created() {
    getTags({ size: 10 }).then(({ data }) => {
      this.options = data.map(tag => ({ ...tag, value: tag.label }))
    })
  },
  methods: {
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        const { data } = await getTags({ query })
        this.options = data.map(tag => ({ ...tag, value: tag.label }))
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
