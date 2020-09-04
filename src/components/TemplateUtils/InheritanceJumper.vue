<template>
  <el-tooltip
    v-if="canBackToInstance || masterId"
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
import { mapMutations } from 'vuex'
import { getNode, shortTagName } from '@/utils/node'
import { getMasterId } from '@/utils/inheritance'

const originalEditing = Vue.observable({
  componentSetId: null,
  componentId: null
})

export default {
  name: 'InheritanceJumper',
  props: {
    id: {
      type: String,
      required: true
    },
    inheritParentId: {
      type: String,
      default: ''
    },
    masterComponentSetId: {
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
    masterId() {
      return getMasterId(this.node)
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
        const el = await asyncGetValue([
          this.vmMap,
          originalEditing.componentId,
          '$el'
        ])

        setTimeout(() => {
          el.scrollIntoView(false)
          this.SET_SELECTED_COMPONENT_ID(originalEditing.componentId)
          originalEditing.componentId = null
          originalEditing.componentSetId = null
        }, 50)
      })
    },
    backToMaster() {
      this.NODE_SET({ editingComponentSetId: this.masterComponentSetId })

      this.$nextTick(async() => {
        const el = await asyncGetValue([this.vmMap, this.masterId, '$el'])
        setTimeout(() => {
          originalEditing.componentId = this.id
          originalEditing.componentSetId = this.node.rootComponentSetId

          el.scrollIntoView(false)
          this.SET_SELECTED_COMPONENT_ID(this.masterId)
        }, 100)
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
