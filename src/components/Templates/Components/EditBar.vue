<template>
  <div>
    <span>{{ tag }} - {{ id }}</span>

    <el-button
      v-if="functions.includes('new')"
      type="text"
      @click="emit('new')"
    >
      <unicon fill="#909399" name="plus" />
    </el-button>

    <el-button
      v-if="functions.includes('copy')"
      type="text"
      @click="emit('copy')"
    >
      <unicon fill="#909399" name="plus" />
    </el-button>

    <el-button
      v-if="functions.includes('remove')"
      type="text"
      @click="emit('remove')"
    >
      <unicon fill="#909399" name="plus" />
    </el-button>

    <el-button
      v-if="functions.includes('setting')"
      type="text"
      @click="emit('setting')"
    >
      <unicon fill="#909399" name="cog" />
    </el-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { emitEditBarFn } from '../../../buses/editBar'

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
    ...mapGetters('nodes', ['childrenOf']),
    tag() {
      if (this.innerChild) {
        return this.innerChild.tag
      } else {
        return this.node && this.node.tag
      }
    },
    node() {
      return this.currentNodesMap[this.id]
    },
    parentId() {
      return this.node.parentId
    },
    innerChild() {
      return this.childrenOf[this.id] && this.childrenOf[this.id][0]
    }
  },
  methods: {
    emit(type) {
      if (this.innerChild && type === 'remove') {
        emitEditBarFn(this.id, { childId: this.innerChild.id, type })
      } else {
        emitEditBarFn(this.parentId, { childId: this.id, type })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.outer {
  position: relative;
}
</style>
