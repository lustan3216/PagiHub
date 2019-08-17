export function mapProps(props = [], { object, event } = {}) {
  return props.reduce((obj, prop) => {
    const propModel = prop + 'Model'
    const computedProp = {
      get() {
        return object ? this[object][prop] : this[prop]
      },
      set(value) {
        if (event) {
          this.$emit(event, { prop, value })
        } else {
          this.$emit(prop, value)
        }
      }
    }
    obj[propModel] = computedProp
    return obj
  }, {})
}
