<template>
  <el-input
    v-if="editing && node"
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
    v-else-if="node"
    v-bind="{ ...$props, ...$attrs }"
    type="text"
    @click="click"
    @dblclick.native="dblclick"
  >
    <slot />

    {{ nodeShortName }}
    <template v-if="isComponent"> - {{ shortId }} </template>
  </el-button>
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { shortTagName, shortId, isComponent } from '@/utils/node'
import { LABEL } from '@/const'

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
    isComponent() {
      return isComponent(this.node)
    },
    nodeShortName() {
      return shortTagName(this.node)
    },
    shortId() {
      return this.isComponent && shortId(this.id)
    },
    editing() {
      return observable.editingId === this.id && this.editable
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
.el-button {
  padding-left: 5px;
  padding-right: 5px;
}
.input {
  z-index: 2;
}
::v-deep.input > input {
  height: 26px;
}
</style>
