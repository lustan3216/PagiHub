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
    :class="{ instance: isInstance }"
    type="text"
    @click="click"
    @dblclick.native="dblclick"
  >
    <template v-if="isMasterParent">
      <i class="el-icon-medal-1" />
    </template>

    <template v-else-if="isInstanceParent">
      <i class="el-icon-medal" />
    </template>

    <span> {{ nodeShortName }} - {{ shortId }} </span>

    <slot />
  </el-button>
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { shortTagName, shortId, isComponent, getNode } from '@/utils/node'
import { LABEL } from '@/const'
import {
  isMasterParent,
  isInstanceParent,
  getMasterId
} from '@/utils/inheritance'

const observable = Vue.observable({ editingId: null })

export default {
  name: 'ComponentName',
  props: {
    id: {
      type: String,
      required: true
    },
    inheritParentId: {
      type: String,
      default: ''
    },
    inheritRootComponentSetId: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: false
    },
    isExample: {
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
      return getNode(this.id, this.isExample)
    },
    isMasterParent() {
      return isMasterParent(this.node)
    },
    isInstanceParent() {
      return isInstanceParent(this.node)
    },
    isInstance() {
      return getMasterId(this.node)
    },
    isComponent() {
      return isComponent(this.node)
    },
    nodeShortName() {
      return shortTagName(this.node)
    },
    shortId() {
      if (process.env.NODE_ENV === 'production' && this.isComponent) {
        return shortId(this.id)
      }
      else {
        return this.id.substring(23, 26)
      }
    },
    editing() {
      return observable.editingId === this.id && this.editable
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
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
$activeColor: rgba(81, 117, 199, 0.68);
$connectColor: rgba(135, 199, 124, 0.68);

::v-deep.instance {
  color: $connectColor !important;
}

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
