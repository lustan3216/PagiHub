<template>
  <div>
    <el-row
      :gutter="10"
      type="flex"
      style="flex-wrap: wrap"
      align="middle"
    >
      <el-col
        v-for="component in basicExamples"
        v-show="searchedExamples.includes(component.tag)"
        :key="component.id"
        :lg="4"
        :md="6"
        :sm="8"
        style="margin-bottom: 35px;"
      >
        <card-example
          :component="component"
          style="width: 100%;height: 100px;"
          @add="$emit('add', component)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { shortTagName } from '@/utils/node'
import CardExample from './CardExample'
import basic from '@/templateJson/basic'

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
    basicExamples() {
      return basic
    },
    searchedExamples() {
      return basic
        .filter(
          x =>
            shortTagName(x)
              .toLowerCase()
              .search(this.search) >= 0
        )
        .map(x => x.tag)
    }
  }
}
</script>
