<template>
  <div
    class="wrapper"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
  >
    <transition name="fade">
      <div
        v-if="isHover"
        class="functions">
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
      return this.$parent.$observableVNode || this.$observable.content
    },
    index() {
      return this.parent.indexOf(this.$observableVNode)
    }
  },
  methods: {
    copy() {
      const cloned = clone(this.$observableVNode)
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
  padding: 15px;
}
.functions {
  top: -35px;
  right: 10px;
  position: absolute;
}
</style>
