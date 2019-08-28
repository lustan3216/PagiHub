<template>
  <transition name="fade">
    <div v-if="visible" class="functions">
      <el-button
        type="text"
        class="wrapper-handler">
        <v-icon name="arrows-alt" />
      </el-button>
      
      <el-button
        type="text"
        @click="copy">
        <v-icon name="copy" />
      </el-button>
      
      <el-button
        type="text"
        @click="remove">
        <v-icon name="trash-alt" />
      </el-button>
  
      <el-button
        type="text"
        @click="$emit('setting')">
      <v-icon name="cog" />
      </el-button>
    </div>
  </transition>
</template>

<script>
import clone from 'clone'
import childrenMixin from '../../mixins/children'

export default {
  name: 'EditBar',
  mixins: [childrenMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    maxKey() {
      return Math.max(...this.innerChildren.map(x => x.key))
    }
  },
  methods: {
    copy() {
      const cloned = clone(this.innerChildren[this.index])
      cloned.key = this.maxKey + 1
      this.innerChildren.splice(this.index, 0, cloned)
    },
    remove() {
      this.innerChildren.splice(this.index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
  .functions {
    top: -5px;
    z-index: 100;
    right: 10px;
    position: absolute;
  }
</style>
