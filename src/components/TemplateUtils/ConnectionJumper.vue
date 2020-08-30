<template>
  <el-tooltip
    v-if="canBackToInstance || node.masterId"
    :content="
      canBackToInstance
        ? `Back to Instance ${instanceComponentSetName}`
        : 'Edit Master Component'
    "
    effect="light"
    placement="top"
  >
    <el-button
      type
      icon="el-icon-share"
      @click="onClick"
    />
  </el-tooltip>
</template>

<script>
import Vue from 'vue'
import { asyncGetValue } from '@/utils/tool'
import { MASTER_ID } from '@/const'
import { mapMutations } from 'vuex'
import { getNode, shortTagName } from '@/utils/node'

const originalEditing = Vue.observable({
  componentSetId: null,
  componentId: null
})

export default {
  name: 'ConnectionJump',
  props: {
    id: {
      type: String,
      required: true
    },
    rootMasterId: {
      type: String,
      default: ''
    }
  },
  computed: {
    node() {
      return getNode(this.id)
    },
    canBackToInstance() {
      return originalEditing.componentSetId
    },
    instanceComponentSetName() {
      return shortTagName(this.componentsMap[originalEditing.componentSetId])
    }
  },
  methods: {
    ...mapMutations('node', {
      NODE_SET: 'SET'
    }),
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID', 'DIALOG_OPEN']),
    onClick() {
      this.canBackToInstance ? this.backToInstance() : this.backToMaster()
    },
    backToInstance() {
      this.NODE_SET({ editingComponentSetId: originalEditing.componentSetId })

      this.$nextTick(async() => {
        const el = await asyncGetValue(() => {
          const id = originalEditing.componentId
          return this.vmMap[id] && this.vmMap[id].$el
        })

        setTimeout(() => {
          el.scrollIntoView(false)
          this.SET_SELECTED_COMPONENT_ID(originalEditing.componentId)
          originalEditing.componentId = null
          originalEditing.componentSetId = null
        }, 50)
      })
    },
    backToMaster() {
      this.NODE_SET({ editingComponentSetId: this.rootMasterId })

      const masterId = this.node[MASTER_ID]

      this.$nextTick(async() => {
        const el = await asyncGetValue(() => {
          return this.vmMap[masterId] && this.vmMap[masterId].$el
        })
        setTimeout(() => {
          originalEditing.componentId = this.id
          originalEditing.componentSetId = this.node.rootComponentSetId

          el.scrollIntoView(false)
          this.SET_SELECTED_COMPONENT_ID(masterId)
        }, 50)
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
