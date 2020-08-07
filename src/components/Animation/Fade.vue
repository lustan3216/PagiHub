<script>
  export default {
    functional: true,
    name: 'Fade',
    render: function (createElement, context) {
      let data = {
        props: {
          name: 'fade-transition',
          mode: 'out-in'
        },
        on: {
          beforeEnter: function (el) {
            // ...
          },
          afterEnter: function (el) {
            // ...
          }
        }
      }

      const { x: left, y: top, width, height } = this.element.getBoundingClientRect()
      if (top && left && width && height) {

        id && cancelAnimationFrame(id)
        let tmpopacity
        const asd = () => {
          tmptop = this.lerp(tmptop, top, 0.1)
          tmpleft = this.lerp(tmpleft, left, 0.1)
          tmpwidth = this.lerp(tmpwidth, width, 0.1)
          tmpheight = this.lerp(tmpheight, height, 0.1)
          tmpopacity = this.lerp(0, 1, 0.02)

          if (this.$refs.asd) {
            this.$refs.asd.style.width = tmpwidth -2 + 'px'
            this.$refs.asd.style.height = tmpheight -2 + 'px'
            this.$refs.asd.style.top = tmptop + 'px'
            this.$refs.asd.style.left = tmpleft + 'px'
            this.$refs.asd.style.opacity = tmpopacity + 'px'
          }

          if (Math.abs(top - tmptop) > 1 || Math.abs(left - tmpleft) > 1 || Math.abs(width - tmpwidth) > 1 || Math.abs(height - tmpheight) > 1) {
            id = requestAnimationFrame(asd.bind(this))
          } else {
            this.$refs.asd.style.width = width -2 + 'px'
            this.$refs.asd.style.height = height -2 + 'px'
            this.$refs.asd.style.top = top + 'px'
            this.$refs.asd.style.left = left + 'px'
            this.$refs.asd.style.opacity = opacity + 'px'
          }
        }

        requestAnimationFrame(asd.bind(this))
      }

      return createElement('transition', data, context.children)
    }
  }
</script>
