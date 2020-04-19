<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SettingGenerator from './Common/SettingGenerator'
import { select, assignDefaultValue } from './utils/util'
import { TYPE as NODE_TYPE } from '@/const'

export const REDIRECT_TO = 'redirectTo'

export const defaultSetting = {
  icon: undefined,
  type: 'primary'
}

export default {
  name: 'SettingFlexButton',
  components: { SettingGenerator },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    ...mapGetters('draft', ['childrenOf']),
    linkableNode() {
      return Object.values(this.nodesMap).filter(
        node => node.type === NODE_TYPE.COMPONENT_SET
      )
    },
    spec() {
      const specArray = [
        select('type', {
          options: [{ label: 'Button', value: null }, 'text']
        })
      ]

      if (!this.childrenOf[this.id].length) {
        const redirectTo = select(REDIRECT_TO, {
          options: this.linkableNode.map(node => ({
            label: `${node.name || node.tag} ${node.id}`,
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
