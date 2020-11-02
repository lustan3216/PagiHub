<template>
  <form-item

    v-model="api"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import { mapActions } from 'vuex'
import propsMixin from '@/components/Templates/mixins/props'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormSlider'
import { PROPS } from '@/const'

export default {
  defaultSetting,
  type: 'slider',
  name: 'FormSlider',
  mixins: [propsMixin, formItemMixin],
  watch: {
    'innerProps.isRange'(value) {
      if (value && !this.isExample) {
        this.record([
          {
            path: `${this.id}.${PROPS}.showInput`,
            value: undefined
          }
        ])
      }
    }
  },
  methods: {
    ...mapActions('node', ['record'])
  }
}
</script>
