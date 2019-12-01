import store from '../store'
import { mergeWith, isPlainObject } from '../lodash'

export default {
  data() {
    const settings = this.$options.settingsTemplate || {}
    const node = store.state.nodes.currentNodesMap[this.id]

    if (this.isEditable && node.props) {
      this.mergeSetting(settings, node.props)
    }

    return {
      settings
    }
  },
  methods: {
    mergeSetting(object, src) {
      // 在settingsTemplate裡面每個值的設定是一個object但存到vuex是單純存一個值而已
      // 所以當是object且vuex拿到得值不是object，代表有設定過，直接覆蓋預設值
      mergeWith(object, src, (objValue, srcValue) => {
        if (isPlainObject(objValue) && !isPlainObject(srcValue)) {
          objValue.value = srcValue
          return objValue
        }
      })
    },
    innerSettings(group = 'basic') {
      const settings = Object.keys(this.settings[group])
      return settings.reduce((all, key) => {
        all[key] = this.settings[group][key].value
        return all
      }, {})
    },
    setSetting(value) {
      this.mergeSetting(this.settings, value)

      this.ASSIGN({
        id: this.id,
        props: value
      })
    }
  }
}
