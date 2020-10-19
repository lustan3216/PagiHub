<template>
  <div>
    <p class="font-12 gray-font-2 m-b-5">
      Allow to enter a new external link
    </p>
    <rules-generator
      :id="id"
      :rules="spec"
    />
  </div>
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
    ...mapState('user', ['username', 'userId']),
    ...mapState('node', ['editingProjectId']),
    linkableComponentSet() {
      return this.nodesMap[this.editingProjectId].children
    },
    options() {
      const { label } = getNode(this.editingProjectId)
      const options = []
      this.linkableComponentSet.forEach(node => {
        if (node.version) {
          options.push({
            label: node.label,
            value: `/${this.username || this.userId}/${label}/${
              node.label
            }`
          })
        }
      })

      return options
    },
    spec() {
      const specArray = [
        select(LINK, {
          props: {
            allowCreate: true,
            filterable: true,
            placeholder: 'Can Create by typing'
          },
          options: this.options
        }),
        boolean(NEW_TAB)
      ]

      return assignDefaultValue(specArray, defaultSetting)
    }
  }
}
</script>
