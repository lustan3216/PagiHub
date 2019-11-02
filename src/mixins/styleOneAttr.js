export default function(array) {
  array = Array.toArray(array)
  return {
    data() {
      const styles = this.getStyles()

      return array.reduce((all, type) => {
        all[type] = styles[type]
        return all
      }, {})
    },
    created() {
      array.forEach(type => {
        this.$watch(type, value => {
          this.assignStyles({ [type]: value })
        })
      })
    }
  }
}
