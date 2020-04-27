import SettingGenerator from './SettingGenerator'
import { assignDefaultValue } from '../utils/ruleTool'
import { capitalize } from '@/utils/string'

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
    render(h, { props }) {
      const children = props.children

      Object.keys(rules).forEach(key => {
        const title = h('h4', capitalize(key))
        const inputs = h(SettingGenerator, {
          props: {
            id: props.id,
            rules: assignDefaultValue(rules[key], defaultSetting)
          }
        })

        children.push(title)
        children.push(inputs)
      })

      return h('div', children)
    }
  }
}
