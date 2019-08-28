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
    
    <component :is="tag" :children="innerChildren" @update="update"/>
  </div>
</template>

<script>
import clone from 'clone'
import importTemplates from '../mixins/importTemplates'

export default {
  name: 'Wrapper',
  mixins: [importTemplates],
  props: {
    tag: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    children: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isHover: false,
      innerData: clone(this.data),
      innerChildren: clone(this.children)
    }
  },
  watch: {
    innerChildren(value) {
      console.log(value)
    }
  },
  methods: {
    update(){
      console.log(123)
    },
    copy() {
      this.$emit('copy', this)
      // const cloned = clone(this.$observableVNode)
      // removeDeepKey(cloned)
      // this.parent.splice(this.index, 0, cloned)
      snapShot()
    },
    remove() {
      this.$emit('remove', this)
      // this.parent.splice(this.index, 1)
      snapShot()
    },
    settings() {
      // this.$observable.nodeForSetting = this.$children[0]
      // openSettingsSidebar()
    },
    setContent(value) {
      this.innerChildren = value
      snapShot()
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
.edit-area {
  min-height: 100px;
}
</style>
