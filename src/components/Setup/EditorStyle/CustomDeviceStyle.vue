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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ItemHiddenController',
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    ...mapGetters('layout', ['validBreakpointPixels']),
    buttons() {
      let lgHidden = false
      let mdHidden = false
      let smHidden = false
      let xsHidden = false
      let xxsHidden = false

      if (this.selectedComponentNodes.length === 1) {
        const { hidden } = this.selectedComponentNodes[0]
        lgHidden = hidden && hidden.lg
        mdHidden = hidden && hidden.md
        smHidden = hidden && hidden.sm
        xsHidden = hidden && hidden.xs
        xxsHidden = hidden && hidden.xxs
      }

      return [
        {
          pixel: this.validBreakpointPixels.lg,
          name: 'lg',
          content: `For Large Monitor, Only display when screen larger than ${this.validBreakpointPixels.lg}px`,
          icon: 'el-icon-data-line',
          hidden: lgHidden
        },
        {
          pixel: this.validBreakpointPixels.md,
          name: 'md',
          content: `For Computer, Only display when screen larger than ${this.validBreakpointPixels.md}px`,
          icon: 'el-icon-monitor',
          hidden: mdHidden
        },
        {
          pixel: this.validBreakpointPixels.sm,
          name: 'sm',
          content: `For Tablet, Only display when screen larger than ${this.validBreakpointPixels.sm}px`,
          icon: 'el-icon-mobile',
          hidden: smHidden
        },
        {
          pixel: this.validBreakpointPixels.xs,
          name: 'xs',
          content: `For Phone, Only display when screen larger than ${this.validBreakpointPixels.xs}px`,
          icon: 'el-icon-mobile-phone',
          hidden: xsHidden,
          class: 'rotate90'
        },
        {
          disabledpixel this.validBreakpointPixels.xxs,
          name: 'xxs',
          content: `For Small Phone, Only display when screen larger than ${this.validBreakpointPixels.xxs}px`,
          icon: 'el-icon-mobile-phone',
          hidden: xxsHidden
        }
      ]
    }
  },
  methods: {
    ...mapActions('node', ['record']),
    click(name, hidden) {
      const records = []

      this.selectedComponentNodes.forEach(node => {
        records.push({
          path: `${node.id}.hidden.${name}`,
          value: hidden || undefined
        })
      })

      this.record(records)
    }
  }
}
</script>

<style scoped lang="scss">
.el-button--mini,
.el-button--mini.is-round {
  padding: 7px 17px !important;
}
</style>
