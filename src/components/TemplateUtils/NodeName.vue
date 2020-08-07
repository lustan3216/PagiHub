<template>
  <el-input
    v-if="editing"
    v-model.trim.lazy="name"
    class="input"
    @keydown.enter.native="enter"
  >
    <el-button
      slot="append"
      icon="el-icon-circle-check"
      @click="enter"
    />
  </el-input>
  <el-button
    v-else
    v-bind="{ ...$props, ...$attrs }"
    type="text"
    @click="click"
    @dblclick.native="dblclick"
  >
    {{ nodeShortName }} - {{ shortId }}
  </el-button>
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { shortTagName, shortId } from '@/utils/node'
import { CAN_NOT_RENAME, LABEL } from '@/const'

const observable = Vue.observable({ editingId: null })

export default {
  name: 'NodeName',
  props: {
    id: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: ''
    }
  },
  computed: {
    node() {
      return this.componentsMap[this.id]
    },
    nodeShortName() {
      return shortTagName(this.node)
    },
    shortId() {
      return shortId(this.id)
    },
    editing() {
      return observable.editingId === this.id && this.editable && !this.node[CAN_NOT_RENAME]
    }
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
    click(event) {
      observable.editingId = null
      this.$emit('click', event)
    },
    dblclick() {
      if (this.editable) {
        this.name = this.nodeShortName
        observable.editingId = this.id
      }
    },
    enter() {
      observable.editingId = null

      if (this.name && this.name !== this.nodeShortName) {
        this.RECORD({
          path: `${this.id}.${LABEL}`,
          value: this.name
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  z-index: 2;
}
::v-deep.input > input {
  height: 26px;
}
</style>
