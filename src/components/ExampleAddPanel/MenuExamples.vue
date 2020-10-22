<template>
  <div>
    <tip-basic-copy class="m-b-20" />

    <el-row
      :gutter="10"
      type="flex"
      style="flex-wrap: wrap"
      align="middle"
    >
      <el-col
        v-for="component in basicComponents"
        v-show="searchedExamples.includes(component.tag)"
        :key="component.tag"
        :lg="6"
        :md="8"
        style="margin-bottom: 35px;"
      >
        <card-example
          :component="component"
          style="width: 100%; height: 140px;"
          @add="$emit('add', component)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CardExample from './CardExample'
import { exampleMap } from '@/templateJson/basic'
import { isGridItem, shortTagName } from '@/utils/node'
import TipBasicCopy from '@/components/Tip/TipBasicCopy'

export default {
  name: 'MenuExamples',
  components: {
    CardExample,
    TipBasicCopy
  },
  props: {
    search: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters('layout', ['currentBreakpoint']),
    basicComponents() {
      return Object.values(exampleMap)
        .map(fn => fn({}, this.currentBreakpoint))
        .filter(node => !isGridItem(node))
    },
    searchedExamples() {
      return this.basicComponents
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
