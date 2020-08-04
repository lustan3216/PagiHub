<template>
  <rules-generator
    :id="id"
    :rules="spec"
    :key="JSON.stringify(allChildren)"
  />
</template>

<script>
import { pxPercent } from '@/validator'
import RulesGenerator from './Common/RulesGenerator'
import { boolean, select, assignDefaultValue, selectUnit } from './utils/ruleTool'
import { shortTagName, traversalChildren } from '@/utils/node'

export const defaultSetting = {
  modal: true,
  direction: 'ltr',
  size: '30%',
  toRoot: true,
  buttonCanCloseId: null
}

export default {
  name: 'SettingDrawer',
  components: { RulesGenerator },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    allChildren() {
      const allChildren = []
      traversalChildren(this.id, child => {
        if (child.tag.includes('button')) {
          allChildren.push(child)
        }
      })
      return allChildren
    },
    options() {
      return this.allChildren.map(node => ({
        value: node.id,
        label: `${shortTagName(node)} ${node.id}`
      }))
    },
    spec() {
      return assignDefaultValue(
        [
          boolean('toRoot'),
          boolean('modal'),
          selectUnit('size', {
            validate: [pxPercent],
            props: { units: ['px', '%'] }
          }),
          select('buttonCanCloseId', {
            options: this.options,
            title: 'buttonCanClose'
          }),
          select('direction', {
            options: [
              { label: 'Left', value: 'ltr' },
              { label: 'Right', value: 'rtl' },
              { label: 'Top', value: 'ttb' },
              { label: 'Bottom', value: 'btt' }
            ]
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>
