<template>
  <rules-generator
    v-if="node"
    ref="generator"
    :id="id"
    :key="JSON.stringify(spec)"
    :rules="spec"
  />
</template>

<script>
import { mapActions } from 'vuex'
import RulesGenerator from './Common/RulesGenerator'
import { assignDefaultValue, boolean, select, number } from './utils/ruleTool'
import { getValueByPath } from '@/utils/tool'
import 'element-ui/lib/theme-chalk/carousel.css'

// https://gs-shop.github.io/vue-slick-carousel/#/api
// data-swiper-parallax 在grid item設定
// speed: 600,
//   parallax: true,
// el: '.swiper-pagination-v', 要+id 因為會卡到nested問題
export const defaultSetting = {
  trigger: 'click',
  autoplay: false,
  interval: 3000,
  indicatorPosition: 'bottom',
  arrow: 'always',
  type: '',
  direction: 'horizontal',
  loop: true,
  allowDrag: false,
  keyboard: true
}

export default {
  name: 'SettingCarousel',
  components: { RulesGenerator },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    spec() {
      const options = this.isHorizontal
        ? ['top', 'bottom', 'none']
        : ['left', 'right', 'none']

      return assignDefaultValue(
        [
          boolean('allowDrag', { info: '' }),
          boolean('loop', { info: '' }),
          boolean('keyboard', { info: '' }),
          boolean('autoplay', {
            info: '',
            control: [
              {
                handle: x => x[0],
                rule: [number('interval', { info: '', step: 3000 })]
              }
            ]
          }),
          select('direction', {
            info: '',
            options: ['horizontal', 'vertical']
          }),
          select('trigger', {
            title: 'indicatorTrigger',
            options: ['hover', 'click']
          }),
          select('indicatorPosition', {
            options
          }),
          select('arrow', {
            info: '',
            options: ['always', 'hover', 'never']
          })
          // select('type', {
          //   info: '',
          //   options: [{ label: 'Default', value: '' }, 'card']
          // })
        ],
        defaultSetting
      )
    },
    node() {
      return this.nodesMap[this.id]
    },
    currentProps() {
      return getValueByPath(this.node, ['props'], {})
    },
    isHorizontal() {
      // undefined situation comes from after the second updating
      // we will delete the value because of same as default
      return (
        this.currentProps.direction === 'horizontal' ||
        this.currentProps.direction === undefined
      )
    },
    arrow() {
      return this.currentProps.arrow
    }
  },
  watch: {
    isHorizontal(value) {
      const { api } = this.$refs.generator
      api.updateRule('indicatorPosition', {
        options: this.spec[3].options,
        value: value ? 'bottom' : 'right'
      })

      api.trigger('indicatorPosition', 'change', value ? 'bottom' : 'right')
    },
    arrow(value) {
      // const IndicatorGrid = this.nodesMap[this.id][CHILDREN].find(
      //   x => x[POLYMORPHISM] === 'indicators'
      // )
      // this.debounceRecord([
      //   {
      //     path: `${IndicatorGrid.id}.${SOFT_DELETE}`,
      //     value: value !== 'custom'
      //   }
      // ])
    }
  },
  methods: {
    ...mapActions('node', ['debounceRecord'])
  }
}
</script>

<style scoped lang="scss">
::v-deep.breakpoints {
  .el-row.is-align-middle {
    padding: 5px 5px 0;
  }
  .el-form-item--mini {
    margin-bottom: 8px;
  }
  .el-col-2 {
    position: absolute;
    top: 0;
  }
  .el-col-2 > [class^='el-icon-'] {
    position: absolute;
    top: -10px;
    font-size: 18px !important;
  }
  .el-col-20 {
    width: 100%;
  }
  .el-icon-circle-plus-outline {
    left: 30px;
  }
}
</style>
