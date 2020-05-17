<template>
  <form-item
    v-free-style="innerStyles"
    v-model="api"
    :rule="innerRule"
    :option="option"
  />
</template>

<script>
import { mapMutations } from 'vuex'
import nodeMixin from '@/components/Templates/mixins/node'
import formItemMixin from '@/components/Templates/mixins/formItem'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormSlider'
import { PROPS } from '@/const'

export default {
  defaultSetting,
  type: 'slider',
  name: 'FormSlider',
  mixins: [nodeMixin, formItemMixin],
  watch: {
    'innerProps.isRange'(value) {
      if (value) {
        this.RECORD([
          {
            path: `${this.id}.${PROPS}.showInput`,
            value: undefined
          }
        ])
      }
    }
  },
  methods: {
    ...mapMutations('component', ['RECORD'])
  }
}
</script>
