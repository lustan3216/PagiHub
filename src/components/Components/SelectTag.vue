<template>
  <el-select
    v-model="innerValue"
    :remote-method="remoteMethod"
    :loading="loading"
    :allow-create="allowCreate"
    v-bind="$attrs"
    :placeholder="allowCreate ? 'All to create new tag.' : placeholder"
    multiple
    filterable
    remote
    reserve-keyword
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
    },
    allowCreate: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Allow to select multiple tags'
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
  beforeMount() {
    getTags({ size: 30 }).then(({ data }) => {
      this.options = data.map(tag => ({ ...tag, value: tag.label }))
    })
  },
  methods: {
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        const { data } = await getTags({ query, size: 30 })
        this.options = data.map(tag => ({ ...tag, value: tag.label }))
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
