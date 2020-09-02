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
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'ItemHiddenController',
  components: {
    ElDivider: Divider
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
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
          name: 'xl',
          content: `Hidden when screen larger than ${BREAK_POINTS.xl}px`,
          icon: 'el-icon-data-line',
          hidden: xlHidden
        },
        {
          name: 'lg',
          content: `Hidden when screen larger than ${BREAK_POINTS.lg}px and smaller than ${BREAK_POINTS.xl}px`,
          icon: 'el-icon-data-line',
          hidden: lgHidden
        },
        {
          name: 'md',
          content: `Hidden when screen larger than ${BREAK_POINTS.md}px and smaller than ${BREAK_POINTS.lg}px`,
          icon: 'el-icon-monitor',
          hidden: mdHidden
        },
        {
          name: 'sm',
          content: `Hidden when screen larger than ${BREAK_POINTS.sm}px and smaller than ${BREAK_POINTS.md}px`,
          icon: 'el-icon-mobile',
          hidden: smHidden
        },
        {
          name: 'xs',
          content: `Hidden when screen larger than ${BREAK_POINTS.xs}px and smaller than ${BREAK_POINTS.sm}px`,
          icon: 'el-icon-mobile-phone',
          hidden: xsHidden,
          class: 'rotate90'
        },
        {
          name: 'xxs',
          content: `Hidden when screen larger than ${BREAK_POINTS.xxs}px and smaller than ${BREAK_POINTS.xs}px`,
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
          path: `${node.id}.style.${name}.hidden`,
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
