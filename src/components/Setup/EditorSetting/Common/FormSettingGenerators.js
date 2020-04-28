import SettingGenerators from './SettingGenerators'
import RulesGenerator from './RulesGenerator'
import { mapState } from 'vuex'
import { select } from '@/components/Setup/EditorSetting/utils/ruleTool'

export default function(name, rules, defaultSetting) {
  return {
    name,
    functional: true,
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    render(h, context) {
      const { props } = context

      return h(SettingGenerators(name, rules, defaultSetting), {
        props: {
          id: props.id,
          children: [h(submit, { props: { id: props.id }})]
        },
        key: props.id
      })
    }
  }
}

const submit = {
  name: 'FormButtons',
  components: {
    SettingGenerators
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
        select('submitButtonId', {
          options: this.submitButtons,
          title: 'Button Id'
        })
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
  },
  render(h) {
    return h('div', [
      h('h4', 'Submit'),
      h(RulesGenerator, {
        props: {
          id: this.id,
          rules: this.rules
        },
        key: JSON.stringify(this.submitButtons)
      })
    ])
  }
}
