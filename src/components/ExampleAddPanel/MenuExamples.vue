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
        >
          <component-giver
            :id="component.id"
            class="outer"
            style="height: 200px;"
          />
        </card-example>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { shortTagName } from '@/utils/node'
import ComponentGiver from '@/components/TemplateUtils/ComponentGiver'
import CardExample from './CardExample'

export default {
  name: 'MenuExamples',
  components: {
    CardExample,
    ComponentGiver
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

<style scoped lang="scss">
.outer {
  padding: 5px;
  border-radius: 3px;
  border: 1px solid $color-grey;
}
</style>
