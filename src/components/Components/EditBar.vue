<template>
  <component
    :is="hasSlot ? 'el-popover' : 'div'"
    :ref="id"
    trigger="hover"
    placement="top">
    <span>{{ tag }} - {{ id }}</span>

    <!--<el-button-->
    <!--type="text"-->
    <!--class="drag-handler">-->
    <!--<v-icon name="arrows-alt" />-->
    <!--</el-button>-->

    <el-button
      v-if="functions.includes('new')"
      type="text"
      @click="emit('new')">
      <v-icon name="plus" />
    </el-button>

    <el-button
      v-if="functions.includes('copy')"
      type="text"
      @click="emit('copy')">
      <v-icon name="copy" />
    </el-button>

    <el-button
      v-if="functions.includes('remove')"
      type="text"
      @click="emit('remove')">
      <v-icon name="trash-alt" />
    </el-button>

    <el-button
      v-if="functions.includes('setting')"
      type="text"
      @click="emit('setting')">
      <v-icon name="cog" />
    </el-button>

    <span
      v-if="hasSlot"
      slot="reference">
      <slot />
    </span>
  </component>
</template>

<script>
import { mapState } from 'vuex'
import { emitEditBarFn } from '../../buses/editBar'

export default {
  name: 'EditBar',
  props: {
    id: {
      type: Number,
      required: true
    },
    functions: {
      type: Array,
      default() {
        return ['new', 'setting', 'copy', 'remove']
      }
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    tag() {
      return this.node && this.node.tag
    },
    node() {
      return this.currentNodesMap[this.id]
    },
    parentId() {
      return this.node.parentId
    },
    hasSlot() {
      return this.$slots.default && this.$slots.default.length
    }
  },
  methods: {
    emit(type) {
      if (['copy', 'remove', 'new'].includes(type)) {
        emitEditBarFn(this.parentId, { childId: this.id, type })
      } else {
        emitEditBarFn(this.id, { type })
      }
    }
  }
}
</script>

<style scoped lang="scss">
/*.functions {*/
/*right: 10px;*/
/*z-index: 100;*/
/*position: absolute;*/
/*width: 220px;*/
/*}*/
.outer {
  position: relative;
}
</style>
