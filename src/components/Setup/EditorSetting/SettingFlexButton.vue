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
import RulesGenerator from './Common/RulesGenerator'
import { assignDefaultValue, boolean } from './utils/ruleTool'
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
    spec() {
      const specArray = [boolean(NEW_TAB)]

      return assignDefaultValue(specArray, defaultSetting)
    }
  }
}
</script>
