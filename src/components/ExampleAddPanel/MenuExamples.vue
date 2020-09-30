<template>
  <div>
    <el-row
      :gutter="25"
      type="flex"
      style="flex-wrap: wrap"
    >
      <el-col
        v-for="(component, index) in basicExamples"
        v-show="searchedExamples.includes(component.id)"
        :key="component.id"
        :span="8"
        style="margin-bottom: 35px;"
      >
        <card-example
          :delay="index * 100"
          :id="component.id"
          @add="$emit('add', component)"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { shortTagName } from '@/utils/node'
import CardExample from './CardExample'

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
  data() {
    return {
      hoverId: null
    }
  },
  computed: {
    ...mapState('example', ['basicExamples']),
    searchedExamples() {
      return this.basicExamples
        .filter(
          x =>
            shortTagName(x)
              .toLowerCase()
              .search(this.search) >= 0
        )
        .map(x => x.id)
    }
  }
}
</script>
