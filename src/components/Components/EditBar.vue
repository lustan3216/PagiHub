<template>
  <div>
    <span>{{ tag }} - {{ id }}</span>

    <el-button
      v-if="functions.includes('new')"
      type="text"
      @click="emit('new')"
    >
      <v-icon name="plus" />
    </el-button>

    <el-button
      v-if="functions.includes('copy')"
      type="text"
      @click="emit('copy')"
    >
      <v-icon name="copy" />
    </el-button>

    <el-button
      v-if="functions.includes('remove')"
      type="text"
      @click="emit('remove')"
    >
      <v-icon name="trash-alt" />
    </el-button>

    <el-button
      v-if="functions.includes('setting')"
      type="text"
      @click="emit('setting')"
    >
      <v-icon name="cog" />
    </el-button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
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
    ...mapGetters('nodes', ['childrenOf']),
    tag() {
      if (this.innerComponent) {
        return this.innerComponent.tag
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
    innerComponent() {
      return this.childrenOf[this.id] && this.childrenOf[this.id][0]
    }
  },
  methods: {
    emit(type) {
      if (this.innerComponent) {
        if (type === 'remove') {
          emitEditBarFn(this.id, { childId: this.innerComponent.id, type })
        } else {
          emitEditBarFn(this.innerComponent.id, { type })
        }
        return
      }

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
.outer {
  position: relative;
}
</style>
