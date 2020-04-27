import SettingGenerators from './SettingGenerators'
import FormButtons from './FormButtons'

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
      const children = [h(FormButtons, { props: { id: props.id }})]

      return h('div', h(SettingGenerators, {
        props: {
          id: props.id,
          children
        }
      }))
    }
  }
}
