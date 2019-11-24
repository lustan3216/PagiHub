<template>
  <div class="layer">
    <portal-target name="Root" />
    <template v-for="(child, index) in innerChildren">
      <el-popover
        :value="isEditBarVisible(child.id)"
        :open-delay="100"
        :close-delay="0"
        :key="`popover${child.id}`"
        :ref="child.id"
        trigger="manual"
        placement="right"
      >
        <edit-bar :id="child.id" />
      </el-popover>

      <component
        v-popover:[child.id]
        :is="child.tag"
        :key="child.id"
        :id="child.id"
        :style="{ 'z-index': index }"
        :class="{ absolute: index }"
        @click.stop.native="openEditBarById(child.id)"
      />
    </template>
  </div>
</template>

<script>
import GridGenerator from './GridGenerator'
import commonMixin from '../../mixins/common'
import childrenMixin from '../../mixins/children'
import EditBar from './Components/EditBar'

export default {
  name: 'Layers',
  components: {
    GridGenerator,
    EditBar
  },
  mixins: [commonMixin, childrenMixin]
}
</script>

<style scoped>
.layers {
  position: relative;
  z-index: 0;
}
.absolute {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>
