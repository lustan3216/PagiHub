<template>
  <el-tooltip
    effect="light"
    content="Stack Mode. It will push other stack container when colliding."
    placement="top"
  >
    <el-button
      :type="isStack ? 'primary' : 'text'"
      :class="{ isStack }"
      data-cy="stack"
      plain
      icon="el-icon-s-grid"
      @click="click"
    />
  </el-tooltip>
</template>

<script>
import { Tooltip } from 'element-ui'
import { mapMutations, mapState } from 'vuex'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'
import { vmGet } from '@/utils/vmMap'

export default {
  name: 'Stack',
  components: {
    ElTooltip: Tooltip
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    isStack() {
      return getValueByPath(vmGet(this.id), ['innerStyles', 'layout', 'stack'])
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    click() {
      this.selectedComponentIds.forEach(id => {
        this.RECORD({
          path: [id, STYLES, 'layout', 'stack'],
          value: this.isStack ? undefined : true
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.isStack:hover,
::v-deep.isStack:focus {
  .el-icon-s-grid {
    color: #fff !important;
  }
}
</style>
