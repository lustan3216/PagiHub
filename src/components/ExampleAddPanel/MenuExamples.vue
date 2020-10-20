<template>
  <div>
    <el-row
      :gutter="10"
      type="flex"
      style="flex-wrap: wrap"
      align="middle"
    >
      <el-col
        v-for="tag in basicTags"
        v-show="searchedExamples.includes(tag)"
        :key="tag"
        :lg="4"
        :md="6"
        :sm="8"
        style="margin-bottom: 35px;"
      >
        <card-example
          :tag="tag"
          style="width: 100%;height: 100px;"
          @add="add(tag)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CardExample from './CardExample'
import { exampleMap, getExample } from '@/templateJson/basic'

export default {
  name: 'MenuExamples',
  components: {
    CardExample
  },
  props: {
    search: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters('layout', ['currentBreakpoint']),
    basicTags() {
      return Object.keys(exampleMap)
    },
    searchedExamples() {
      return this.basicTags
        .filter(tag => tag.toLowerCase().search(this.search) >= 0)
    }
  },
  methods: {
    add(tag) {
      this.$emit('add', getExample(tag, this.currentBreakpoint))
    }
  }
}
</script>
