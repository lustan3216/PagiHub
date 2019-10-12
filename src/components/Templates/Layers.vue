<template>
  <div>
    <template v-for="child in innerChildren">
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
        @click.stop.native="openEditBarById(child.id)"
      />
    </template>
  </div>
</template>

<script>
import GridGenerator from './GridGenerator'
import commonMixin from '../../mixins/common'
import childrenMixin from '../../mixins/children'
import EditBar from '../Components/EditBar'

export default {
  name: 'Layers',
  components: {
    GridGenerator,
    EditBar
  },
  mixins: [commonMixin, childrenMixin]
}
</script>
