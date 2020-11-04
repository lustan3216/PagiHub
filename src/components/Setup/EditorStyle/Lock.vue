<template>
  <el-button
    v-if="isButton && (visible || lock)"
    :icon="lock ? 'el-icon-lock' : 'el-icon-unlock'"
    type="text"
    @click.stop="click"
  />
  <div
    v-else
    @click.stop="click"
  >
    <slot :lock="lock" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

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
    },
    allowMulti: {
      type: Boolean,
      default: false
    },
    type: {
      validator: value => ['button', 'text'].includes(value),
      default: 'button'
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    isButton() {
      return this.type === 'button'
    },
    node() {
      return this.nodesMap[this.id]
    },
    lock() {
      return this.node && this.node.lock
    }
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    click() {
      if (this.allowMulti) {
        this.selectedComponentIds.forEach(id => {
          this.debounceRecord({
            path: [id, 'lock'],
            value: this.lock ? undefined : true
          })
        })
      }
      else {
        this.debounceRecord({
          path: [this.id, 'lock'],
          value: this.lock ? undefined : true
        })
      }
    }
  }
}
</script>
