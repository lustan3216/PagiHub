<template>
  <el-button
    v-if="visible || lock"
    :icon="lock ? 'el-icon-lock' : 'el-icon-unlock'"
    type="text"
    @click.stop="click"
  />
</template>

<script>
import { getNode } from '@/utils/node'
import { mapMutations } from 'vuex'

export default {
  name: 'Lock',
  props: {
    id: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    node() {
      return getNode(this.id)
    },
    lock() {
      return this.node && this.node.lock
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    click() {
      this.RECORD({
        path: [this.id, 'lock'],
        value: this.lock ? undefined : true
      })
    }
  }
}
</script>
