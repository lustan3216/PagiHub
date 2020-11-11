<template>
  <div
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <transition-group
      name="full-slide"
      class="align-center"
    >
      <template v-for="(node, index) in nodesPath">
        <i
          v-if="hovering && index"
          :key="node.id + 'i'"
          class="el-icon-arrow-left"
        />
        <component-name
          v-if="hovering || node.id === id"
          :style="{ cursor: index ? 'pointer' : 'default' }"
          :key="node.id"
          :id="node.id"
          :editable="false"
          @click="SET_SELECTED_COMPONENT_ID(node.id)"
        />
      </template>
    </transition-group>
  </div>
</template>

<script>
import ComponentName from './ComponentName'
import { isBackground, isGrid, traversalAncestorAndSelf } from '@/utils/node'
import { mapMutations } from 'vuex'

let timerId
export default {
  name: 'ComponentNames',
  components: {
    ComponentName
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      hovering: false
    }
  },
  computed: {
    node() {
      return this.nodesMap[this.id]
    },
    nodesPath() {
      if (!this.isDraftMode) {
        return [this.node]
      }

      const nodes = []
      traversalAncestorAndSelf(this.node, node => {
        if (!isGrid(node)) {
          nodes.push(node)
        }

        return !isBackground(node)
      })
      return nodes.slice(0, 4)
    }
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    mouseenter() {
      timerId = setTimeout(() => {
        this.hovering = true
      }, 100)
    },
    mouseleave() {
      clearTimeout(timerId)
      this.hovering = false
    }
  }
}
</script>
