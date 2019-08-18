<template>
  <div
    class="wrapper"
    @mouseover="isHover = true"
    @mouseleave="isHover = false">
    <transition name="fade">
      <div
        v-if="isHover"
        class="functions">
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
          @click="settings">
          <v-icon name="cog" />
        </el-button>
      </div>
    </transition>
    <slot />
  </div>
</template>

<script>
import clone from 'clone'
import { snapShot, openSettingsSidebar } from '../observable/methods'
import { removeDeepKey } from '../utils/keyId'
export default {
  name: 'Wrapper',
  data() {
    return {
      isHover: false
    }
  },
  computed: {
    parent() {
      return this.$parent.$observableNode || this.$observable.content
    },
    index() {
      return this.parent.indexOf(this.$observableNode)
    }
  },
  methods: {
    copy() {
      const cloned = clone(this.$observableNode)
      removeDeepKey(cloned)
      this.parent.splice(this.index, 0, cloned)
      snapShot()
    },
    remove() {
      this.parent.splice(this.index, 1)
      snapShot()
    },
    settings() {
      this.$observable.nodeForSetting = this.$children[0]
      openSettingsSidebar()
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  padding: 35px;
}
.functions {
  top: -5px;
  right: 10px;
  position: absolute;
}
</style>
