<template>
  <div>
    <el-divider content-position="left">
      HIDDEN WHEN
    </el-divider>

    <el-button-group class="group">
      <el-tooltip
        v-for="button in buttons"
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
import { Divider } from 'element-ui'
import { BREAK_POINTS } from '@/const'

export default {
  name: 'ItemHiddenController',
  components: {
    ElDivider: Divider
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
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
          name: 'lg',
          content: `For Large Monitor, Only display when screen larger than ${BREAK_POINTS.lg}px`,
          icon: 'el-icon-data-line',
          hidden: lgHidden
        },
        {
          name: 'md',
          content: `For Computer, Only display when screen larger than ${BREAK_POINTS.md}px`,
          icon: 'el-icon-monitor',
          hidden: mdHidden
        },
        {
          name: 'sm',
          content: `For Tablet, Only display when screen larger than ${BREAK_POINTS.sm}px`,
          icon: 'el-icon-mobile',
          hidden: smHidden
        },
        {
          name: 'xs',
          content: `For Phone, Only display when screen larger than ${BREAK_POINTS.xs}px`,
          icon: 'el-icon-mobile-phone',
          hidden: xsHidden,
          class: 'rotate90'
        },
        {
          name: 'xxs',
          content: `For Small Phone, Only display when screen larger than ${BREAK_POINTS.xxs}px`,
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
          path: `${node.id}.hidden.${name}`,
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
  padding: 7px 17px !important;
}
</style>
