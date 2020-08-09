<template>
  <div>
    <el-divider content-position="left">
      DISPLAY WHEN
    </el-divider>

    <el-button-group class="group">
      <el-tooltip
        v-for="button in buttons"
        :content="button.content"
        effect="light"
        placement="top"
      >
        <el-button
          :disabled="!parentNodes.length"
          :type="button.hidden === true ? '' : 'primary'"
          plain
          @click="click(button.name, !Boolean(button.hidden))"
        >
          <i :class="[button.icon, button.class]"/>
        </el-button>
      </el-tooltip>

    </el-button-group>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { isGridItem } from '@/utils/node'
import { Tooltip, Divider } from 'element-ui'

export default {
  name: 'ItemHiddenController',
  components: {
    ElTooltip: Tooltip,
    ElDivider: Divider
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    nodes() {
      return this.selectedComponentIds.map(id => this.componentsMap[id])
    },
    parentNodes() {
      return this.nodes.reduce((all, node) => {
        if (!isGridItem(node) && isGridItem(node.parentNode)) {
          all.push(node.parentNode)
        }
        return all
      }, [])
    },
    buttons() {
      let lgHidden = false
      let mdHidden = false
      let smHidden = false
      let xsHidden = false
      let xxsHidden = false

      if (this.parentNodes.length === 1) {
        lgHidden = this.parentNodes[0].props.lg.hidden
        mdHidden = this.parentNodes[0].props.md.hidden
        smHidden = this.parentNodes[0].props.sm.hidden
        xsHidden = this.parentNodes[0].props.xs.hidden
        xxsHidden = this.parentNodes[0].props.xxs.hidden
      }

      return [
        { name: 'lg', content: 'For Large Monitor, Only display when screen larger than 1200px', icon: 'el-icon-data-line', hidden: lgHidden },
        { name: 'md', content: 'For Computer, Only display when screen larger than 996px', icon: 'el-icon-monitor', hidden: mdHidden },
        { name: 'sm', content: 'For Tablet, Only display when screen larger than 768px', icon: 'el-icon-mobile', hidden: smHidden },
        { name: 'xs', content: 'For Phone, Only display when screen larger than 480px', icon: 'el-icon-mobile-phone', hidden: xsHidden, class: 'rotate90' },
        { name: 'xxs', content: 'For Small Phone, Only display when screen larger than 0px', icon: 'el-icon-mobile-phone', hidden: xxsHidden }
      ]
    }
  },
  methods: {
    ...mapMutations('component', ['RECORD']),
    click(name, hidden) {
      const records = []

      this.parentNodes.forEach(node => {
        records.push({
          path: `${node.id}.props.${name}.hidden`,
          value: hidden || undefined
        })
      })

      this.RECORD(records)
    }
  }
}
</script>

<style scoped lang="scss">
.el-button--mini, .el-button--mini.is-round{
  padding: 7px 17px !important;
}
</style>
