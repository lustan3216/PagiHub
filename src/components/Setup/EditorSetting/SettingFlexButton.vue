<template>
  <rules-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import RulesGenerator from './Common/RulesGenerator'
import { select, assignDefaultValue } from './utils/ruleTool'
import { CHILDREN, NODE_TYPE } from '@/const'
import { isComponentSet } from '@/utils/node'

export const REDIRECT_TO = 'redirectTo'

export const defaultSetting = {
  icon: undefined,
  type: 'primary'
}

export default {
  name: 'SettingFlexButton',
  components: { RulesGenerator },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    linkableComponentSet() {
      return Object.values(this.nodesMap).filter(
        node => isComponentSet(node)
      )
    },
    spec() {
      const specArray = [
        select('type', {
          options: [{ label: 'Button', value: 'primary' }, 'text']
        })
      ]

      if (!this.nodesMap[this.id][CHILDREN].length) {
        const redirectTo = select(REDIRECT_TO, {
          options: this.linkableComponentSet.map(node => ({
            label: `${node.label || node.tag} ${node.id}`,
            value: node.id
          }))
        })

        specArray.push(redirectTo)
      }

      return assignDefaultValue(specArray, defaultSetting)
    }
  }
}
</script>
