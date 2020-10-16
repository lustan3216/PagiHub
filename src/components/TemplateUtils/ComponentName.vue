<template>
  <el-input
    v-if="editing && node"
    v-model.trim.lazy="name"
    class="input"
    @keydown.enter.native="enter"
  >
    <el-button
      slot="append"
      icon="el-icon-check"
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
    <span class="icon">
      <slot
        name="icon"
      />
    </span>

    <template v-if="textShowContent && isTextEditor">
      <span>
        {{ node.value ? node.value.slice(0, 15) : 'TextEditor' }}{{ shortId }}
      </span>
    </template>
    <template v-else>
      <span> {{ nodeShortName }}{{ shortId }} </span>
    </template>

    <slot />
  </el-button>
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import {
  shortTagName,
  getNode,
  isTextEditor,
  isComponentSet
} from '@/utils/node'
import { LABEL } from '@/const'
import { BIconXDiamond, BIconXDiamondFill } from 'bootstrap-vue'
const observable = Vue.observable({ editingId: null })

export default {
  name: 'ComponentName',
  components: {
    BIconXDiamond,
    BIconXDiamondFill
  },
  props: {
    id: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    },
    textShowContent: {
      type: Boolean,
      default: false
    },
    isExample: {
      type: Boolean,
      default: false
    },
    showParent: {
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
    isTextEditor() {
      return isTextEditor(this.node)
    },
    nodeShortName() {
      return isComponentSet(this.node)
        ? this.node.label
        : shortTagName(this.node)
    },
    shortId() {
      if (process.env.NODE_ENV !== 'production') {
        return `- ${this.id.substring(23, 26)}`
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
$color-active: rgba(81, 117, 199, 0.68);
$connectColor: rgba(135, 199, 124, 0.68);

::v-deep.instance {
  color: $connectColor !important;
}

::v-deep.el-button {
  padding-left: 5px;
  padding-right: 5px;
  span {
    transition: color 300ms ease;
  }

  :hover {
    color: rgba(39, 39, 79, 0.68);
  }

  svg {
    font-size: 15px;
    margin-right: 5px;
  }

  & > span {
    display: flex;
    align-items: center;
  }
}
.input {
  z-index: 2;
}
::v-deep.input > input {
  height: 26px;
  padding-left: 6px;
}
</style>
