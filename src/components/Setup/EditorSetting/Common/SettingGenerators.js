import RulesGenerator from './RulesGenerator'
import { assignDefaultValue } from '../utils/ruleTool'
import { capitalize } from '@/utils/string'
import { isArray } from '@/utils/tool'

export default function(name, rules, defaultSetting) {
  return {
    name,
    functional: true,
    props: {
      id: {
        type: Number,
        required: true
      },
      children: {
        type: Array,
        default: () => []
      }
    },
    render(h, context) {
      const { props } = context
      const children = props.children

      if (isArray(rules)) {
        const inputs = h(RulesGenerator, {
          props: {
            id: props.id,
            rules: assignDefaultValue(rules, defaultSetting)
          },
          key: props.id
        })

        children.push(inputs)
      } else {
        Object.keys(rules).forEach(key => {
          const title = h('h4', capitalize(key))
          const inputs = h(RulesGenerator, {
            props: {
              id: props.id,
              rules: assignDefaultValue(rules[key], defaultSetting)
            },
            key: props.id + key
          })

          children.push(title)
          children.push(inputs)
        })
      }

      return h('div', children)
    }
  }
}
