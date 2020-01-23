<template>
  <div>
    <box-shadow />
  </div>
</template>

<script>
import BoxShadow from './BoxShadow'
import csso from 'csso'

export default {
  name: 'BoxShadows',
  components: {
    BoxShadow
  },
  props: ['computedStyle'],
  data() {
    const array = this.computedStyle.boxShadow

    const a = csso.minifyBlock(
      'box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1), 2px 2px 3px 3px rgba(0, 0, 0, 0.2)'
    )

    console.log(csso)
    // csso
    return {
      boxShadow: this.computedStyle.boxShadow,
      radio: null,
      horizontal: null,
      vertical: null,
      blur: null,
      spread: null,
      color: null
    }
  }
}
</script>
