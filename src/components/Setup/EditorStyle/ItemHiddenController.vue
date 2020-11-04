<template>
  <div>
    <el-divider content-position="left">
      HIDDEN WHEN
    </el-divider>

    <el-tooltip
      v-for="(point, index) in descBreakpoints"
      :content="content(point, index)"
      :key="point"
      effect="light"
      placement="top"
    >
      <el-button
        :disabled="!selectedComponentNodes.length"
        :type="isHidden(point) ? 'primary' : ''"
        plain
        @click="click(point, !isHidden(point))"
      >
        <button-device
          :point-key="point"
          icon-only
        />
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { STYLES, BREAK_POINTS_MAP } from '@/const'
import ButtonDevice from '@/components/Components/ButtonDevice'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'ItemHiddenController',
  components: {
    ButtonDevice
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    ...mapGetters('layout', ['descBreakpoints'])
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    content(key, index) {
      return index
        ? `Hidden when screen ${BREAK_POINTS_MAP[key]}px - ${
          BREAK_POINTS_MAP[this.descBreakpoints[index - 1]]
        }px`
        : `Hidden when screen ${BREAK_POINTS_MAP[key]}px - ∞`
    },

    isHidden(point) {
      if (this.selectedComponentNodes.length === 1) {
        return getValueByPath(this.selectedComponentNodes[0], [
          STYLES,
          point,
          'hidden'
        ])
      }
      else {
        return false
      }
    },
    click(point, hidden) {
      const records = []

      this.selectedComponentNodes.forEach(node => {
        records.push({
          path: [node.id, STYLES, point, 'hidden'],
          value: hidden || undefined
        })
      })

      this.debounceRecord(records)
    }
  }
}
</script>

<style scoped lang="scss">
.el-button--mini,
.el-button--mini.is-round {
  padding: 7px 13px !important;
}
</style>

<style scoped lang="scss">
::v-deep.el-button {
  border-color: transparent;
  border-radius: 3px;
  margin-left: 0;

  &.is-disabled.is-plain,
  &.is-disabled.is-plain:focus,
  &.is-disabled.is-plain:hover {
    border-color: transparent;
  }
}
</style>
