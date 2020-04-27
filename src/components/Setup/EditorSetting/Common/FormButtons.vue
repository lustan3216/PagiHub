<template>
  <div>
    <h4>Submit</h4>
    <setting-generator
      :id="id"
      :rules="rules"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SettingGenerator from './SettingGenerator'
import { select } from '../utils/ruleTool'

export default {
  name: 'FormButtons',
  components: {
    SettingGenerator
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    submitButtons() {
      return this.findButtonIds('form-submit')
    },
    rules() {
      return [
        select('submitButtonId', { options: this.submitButtons, title: 'Button Id' })
      ]
    }
  },
  methods: {
    findButtonIds(tagName) {
      return Object.values(this.nodesMap).reduce((acc, x) => {
        if (x.tag === tagName) {
          acc.push(x.id)
        }
        return acc
      }, [])
    }
  }
}
</script>
