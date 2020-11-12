<script>
export default {
  name: 'SendToTop',
  data() {
    return {
      mounted: false,
      style: {
        top: undefined,
        left: undefined
      }
    }
  },
  mounted() {
    const { x, y } = this.$slots.default[0].elm.getBoundingClientRect()
    this.style.top = y + 'px'
    this.style.left = x + 'px'

    this.$slots.default[0].data.style = this.style

    this.mounted = true
  },
  render(h) {
    return h('portal', {
      props: {
        to: 'App',
        disabled: !this.mounted
      }
    },
    this.$slots.default)
  }
}
</script>

<style scoped lang="scss">

</style>
