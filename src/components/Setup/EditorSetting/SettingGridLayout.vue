<template>
  <div>
    <setting-generator
      :id="id"
      :rules="spec"
    />

    <template v-if="responsive">
      <h4>Breakpoints</h4>
      <setting-generator
        :key="JSON.stringify(breakpoints)"
        :id="id"
        :rules="breakpoints"
      />

      <h4>Columns</h4>
      <setting-generator
        :key="JSON.stringify(cols)"
        :id="id"
        :rules="cols"
      />
    </template>
  </div>
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { boolean, assignDefaultValue, number } from './utils/ruleTool'

export const defaultSetting = {
  isResizable: true,
  isDraggable: true,
  preventCollision: false,
  verticalCompact: false,
  responsive: true,
  rowHeight: 1,
  horizontalMargin: 0,
  verticalMargin: 0,
  colNum: 12,
  breakpoints: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0
  },
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
}

export default {
  name: 'SettingGridLayout',
  components: { SettingGenerator },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      spec: assignDefaultValue(
        [
          boolean('isResizable'),
          boolean('isDraggable'),
          boolean('preventCollision'),
          boolean('verticalCompact'),
          boolean('responsive', {
            control: [
              {
                value: false,
                rule: [number('colNum', { title: 'Column Number' })]
              }
            ]
          }),
          number('horizontalMargin'),
          number('verticalMargin')
        ],
        defaultSetting
      )
    }
  },
  computed: {
    currentProps() {
      return this.draftNodesMap[this.id].props || {}
    },
    responsive() {
      return this.currentProps.responsive === undefined
    },
    breakpoints() {
      return assignDefaultValue(
        [
          number('lg', {
            path: 'breakpoints',
            title: 'Large Desktop',
            info: this.info('lg')
          }),
          number('md', {
            path: 'breakpoints',
            title: 'Desktop',
            info: this.info('md')
          }),
          number('sm', {
            path: 'breakpoints',
            title: 'Tablet',
            info: this.info('sm')
          }),
          number('xs', {
            path: 'breakpoints',
            title: 'Mobile',
            info: this.info('xs')
          }),
          number('xxs', {
            path: 'breakpoints',
            title: 'Tiny Mobile',
            props: { disabled: true },
            info: this.info('xxs')
          })
        ],
        defaultSetting
      )
    },

    cols() {
      return assignDefaultValue(
        [
          number('lg', {
            path: 'cols',
            title: 'Large Desktop',
            info: this.info('lg')
          }),
          number('md', {
            path: 'cols',
            title: 'Desktop',
            info: this.info('md')
          }),
          number('sm', {
            path: 'cols',
            title: 'Tablet',
            info: this.info('sm')
          }),
          number('xs', {
            path: 'cols',
            title: 'Mobile',
            info: this.info('xs')
          }),
          number('xxs', {
            path: 'cols',
            title: 'Tiny Mobile',
            info: this.info('xxs')
          })
        ],
        defaultSetting
      )
    }
  },
  methods: {
    info(x) {
      const cols =
        (this.currentProps.cols && this.currentProps.cols[x]) ||
        defaultSetting.cols[x]
      const breakpoint =
        (this.currentProps.breakpoints && this.currentProps.breakpoints[x]) ||
        defaultSetting.breakpoints[x]
      return `Have columns ${cols} when screen width is bigger than ${breakpoint}px`
    }
  }
}
</script>
