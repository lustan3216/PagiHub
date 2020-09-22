<template>
  <rules-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import { mapState } from 'vuex'
import RulesGenerator from './Common/RulesGenerator'
import { select, assignDefaultValue, boolean } from './utils/ruleTool'
import { getNode } from '@/utils/node'

const LINK = 'link'
const NEW_TAB = 'newTab'

export const defaultSetting = {
  [NEW_TAB]: true
}

export default {
  name: 'SettingFlexButton',
  components: {
    RulesGenerator
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('user', [
      'username',
      {
        userId: 'id'
      }
    ]),
    ...mapState('node', ['editingProjectId']),
    linkableComponentSet() {
      return this.nodesMap[this.editingProjectId].children
    },
    spec() {
      const project = getNode(this.editingProjectId)
      const specArray = [
        boolean(NEW_TAB),
        select(LINK, {
          props: {
            allowCreate: true,
            filterable: true,
            placeholder: 'Can Create by typing'
          },
          options: this.linkableComponentSet.map(node => ({
            label: node.label,
            value: `/${this.username || this.userId}/${project.label}/${
              node.label
            }`
          }))
        })
      ]

      return assignDefaultValue(specArray, defaultSetting)
    }
  }
}
</script>
