<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="functions">
      <el-button
        type="text"
        class="wrapper-handler">
        <v-icon name="arrows-alt" />
      </el-button>
      
      <el-button
        type="text"
        @click="$emit('copy')">
        <v-icon name="copy" />
      </el-button>
      
      <el-button
        type="text"
        @click="$emit('remove')">
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
import childrenMixin from '../../mixins/children'

export default {
  name: 'EditBar',
  mixins: [childrenMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
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
