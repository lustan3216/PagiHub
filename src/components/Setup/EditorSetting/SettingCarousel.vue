<template>
  <rules-generator
    ref="generator"
    :id="id"
    :rules="spec"
  />
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import RulesGenerator from './Common/RulesGenerator'
import { assignDefaultValue, boolean, select, number } from './utils/ruleTool'
import { SOFT_DELETE, LAYERS } from '@/const'

// https://gs-shop.github.io/vue-slick-carousel/#/api
// data-swiper-parallax 在grid item設定
// speed: 600,
//   parallax: true,
// el: '.swiper-pagination-v', 要+id 因為會卡到nested問題
export const defaultSetting = {
  trigger: 'hover',
  autoplay: false,
  interval: 3000,
  indicatorPosition: 'bottom',
  arrow: 'always',
  type: '',
  direction: 'horizontal',
  loop: true,
  allowDrag: true,
  keyboard: true
}

export default {
  name: 'SettingCarousel',
  components: { RulesGenerator },
  props: {
    id: {
      type: Number,
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
                handle: x => x !== 'none',
                rule: [number('interval', { info: '', step: 100 })]
              }
            ]
          }),
          select('indicatorPosition', {
            options,
            info: '',
            control: [
              {
                handle: x => x !== 'none',
                rule: [
                  select('trigger', {
                    info: '',
                    title: 'indicatorTrigger',
                    options: ['hover', 'click']
                  })
                ]
              }
            ]
          }),
          select('arrow', {
            info: '',
            options: ['always', 'hover', 'never', 'custom']
          }),
          select('type', {
            info: '',
            options: [{ label: 'General', value: '' }, 'card']
          }),
          select('direction', { info: '', options: ['horizontal', 'vertical'] })
        ],
        defaultSetting
      )
    },
    currentProps() {
      return this.draftNodesMap[this.id].props || {}
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
    },
    ...mapGetters('draft', ['childrenOf'])
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
      const layersNode = this.childrenOf[this.id].find(
        x => x.tag === LAYERS
      )
      this.RECORD([
        {
          path: `${layersNode.id}.${SOFT_DELETE}`,
          value: value !== 'custom'
        }
      ])
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD'])
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
