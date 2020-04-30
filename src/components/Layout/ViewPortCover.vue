<template>
  <portal-target
    ref="viewPortCover"
    :class="{ class: !isDraftMode }"
    class="fake-transform"
    name="Root"
  />
</template>

<script>
import { arrayLast } from '@/utils/tool'
export default {
  name: 'ViewPortCover',
  props: {
    viewPortEl: {
      type: HTMLDivElement,
      required: true
    }
  },
  beforeCreate() {
    require('mutationobserver-shim')
  },
  mounted() {
    const { $el } = this.$refs.viewPortCover

    this.childListObserver = new MutationObserver(mutations => {
      const hasChild = arrayLast(mutations).target.children.length
      $el.classList[hasChild ? 'add' : 'remove']('z1000')
    })

    this.childListObserver.observe($el, {
      childList: true,
      attributes: false,
      characterData: false
    })

    this.styleObserver = new MutationObserver(mutations => {
      const { width, height, transform, webkitTransform } = arrayLast(
        mutations
      ).target.style

      Object.assign($el.style, {
        width,
        height,
        transform,
        webkitTransform
      })
    })

    this.styleObserver.observe(this.viewPortEl, {
      attributeOldValue: false,
      characterData: false,
      attributeFilter: ['style']
    })
  },
  beforeDestroy() {
    this.styleObserver.disconnect()
    this.childListObserver.disconnect()
  }
}
</script>

<style scoped lang="scss">
.z1000 {
  z-index: 1000;
}
.class {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
