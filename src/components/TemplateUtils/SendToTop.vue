<script>
  export default {
    name: 'SendToTop',
    data() {
      return {
        mounted: false
      }
    },
    computed: {
      style() {
        return {

        }
      }
    },
    mounted() {
      const { x , y } =  this.$slots.default[0].elm.getBoundingClientRect()
      this.$slots.default[0].data.style = {
        left: x + 'px',
        top: y + 'px'
      }
      this.$nextTick(() => {

        this.mounted = true
      })
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
