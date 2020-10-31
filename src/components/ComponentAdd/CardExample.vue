<template>
  <el-button
    :disabled="canNotAdd"
    style="border-color: #f1f1f1"
    @click="$emit('add')"
  >
    <div
      class="text-center m-b-10"
      style="padding: 10px 0;"
    >
      <b>{{ shortTagName(component) }}</b>
    </div>

    <div
      class="relative z-index1 p-1"
      style="font-size: 20px;"
    >
      <element-icon
        :icon="component.tag"
        class="gray-font-2"
      />
    </div>

    <p
      class="small-title"
      style="white-space: initial"
    >
      {{ description }}
    </p>
  </el-button>
</template>

<script>
import { shortTagName, isComponentSet, isGrid } from '@/utils/node'
import ArtBoard from '../Layout/ArtBoard'
import { Tag } from 'element-ui'
import { mapState } from 'vuex'
import { descriptionMap } from '@/templateJson/basic'
import ElementIcon from '@/components/Components/ElementIcon'

export default {
  name: 'CardExample',
  components: {
    ArtBoard,
    ElTag: Tag,
    ElementIcon
  },
  props: {
    component: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapState('app', ['beingAddedComponentId']),
    node() {
      return this.nodesMap[this.beingAddedComponentId]
    },
    canNotAdd() {
      return isComponentSet(this.node) && !isGrid(this.component)
    },
    description() {
      return descriptionMap[this.component.tag]
    }
  },
  methods: {
    shortTagName
  }
}
</script>

<style scoped lang="scss">
.outer {
  padding: 5px;
  height: 200px;
  border-radius: 3px;
  border: 1px solid $color-grey;
}
</style>
