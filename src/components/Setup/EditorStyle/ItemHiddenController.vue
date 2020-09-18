<template>
  <div>
    <el-divider content-position="left">
      HIDDEN WHEN
    </el-divider>

    <el-button-group class="group">
      <el-tooltip
        v-for="button in buttons"
        v-if="button.pixel"
        :content="button.content"
        effect="light"
        placement="top"
      >
        <el-button
          :disabled="!selectedComponentNodes.length"
          :type="button.hidden === true ? 'primary' : ''"
          plain
          @click="click(button.name, !Boolean(button.hidden))"
        >
          <i :class="[button.icon, button.class]" />
        </el-button>
      </el-tooltip>
    </el-button-group>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { STYLES } from '@/const'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'ItemHiddenController',
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    ...mapGetters('layout', ['validBreakpointPixels']),
    buttons() {
      let xlHidden = false
      let lgHidden = false
      let mdHidden = false
      let smHidden = false
      let xsHidden = false
      let xxsHidden = false

      if (this.selectedComponentNodes.length === 1) {
        const node = this.selectedComponentNodes[0]
        xlHidden = getValueByPath(node, 'style.xl.hidden')
        lgHidden = getValueByPath(node, 'style.lg.hidden')
        mdHidden = getValueByPath(node, 'style.md.hidden')
        smHidden = getValueByPath(node, 'style.sm.hidden')
        xsHidden = getValueByPath(node, 'style.xs.hidden')
        xxsHidden = getValueByPath(node, 'style.xxs.hidden')
      }

      return [
        {
          pixel: this.validBreakpointPixels.xl,
          name: 'xl',
          content: `Hidden when screen larger than ${this.validBreakpointPixels.xl}px`,
          icon: 'el-icon-data-line',
          hidden: xlHidden
        },
        {
          pixel: this.validBreakpointPixels.lg,
          name: 'lg',
          content: `Hidden when screen larger than ${this.validBreakpointPixels.lg}px and smaller than ${this.validBreakpointPixels.xl}px`,
          icon: 'el-icon-data-line',
          hidden: lgHidden
        },
        {
          pixel: this.validBreakpointPixels.md,
          name: 'md',
          content: `Hidden when screen larger than ${this.validBreakpointPixels.md}px and smaller than ${this.validBreakpointPixels.lg}px`,
          icon: 'el-icon-monitor',
          hidden: mdHidden
        },
        {
          pixel: this.validBreakpointPixels.sm,
          name: 'sm',
          content: `Hidden when screen larger than ${this.validBreakpointPixels.sm}px and smaller than ${this.validBreakpointPixels.md}px`,
          icon: 'el-icon-mobile',
          hidden: smHidden
        },
        {
          pixel: this.validBreakpointPixels.xs,
          name: 'xs',
          content: `Hidden when screen larger than ${this.validBreakpointPixels.xs}px and smaller than ${this.validBreakpointPixels.sm}px`,
          icon: 'el-icon-mobile-phone',
          hidden: xsHidden,
          class: 'rotate90'
        },
        {
          pixel: this.validBreakpointPixels.xxs,
          name: 'xxs',
          content: `Hidden when screen larger than ${this.validBreakpointPixels.xxs}px and smaller than ${this.validBreakpointPixels.xs}px`,
          icon: 'el-icon-mobile-phone',
          hidden: xxsHidden
        }
      ]
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    click(name, hidden) {
      const records = []

      this.selectedComponentNodes.forEach(node => {
        records.push({
          path: `${node.id}.${STYLES}.${name}.hidden`,
          value: hidden || undefined
        })
      })

      this.RECORD(records)
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
