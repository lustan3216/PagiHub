<template>
  <div>
    <box-shadow />
  </div>
</template>

<script>
import BoxShadow from './BoxShadow'
import { parse, stringify } from 'css-box-shadow'

export default {
  name: 'BoxShadows',
  components: {
    BoxShadow
  },
  props: ['computedStyle'],
  data() {
    const array = this.computedStyle.boxShadow

    const asd = parse(array)

    // csso
    return {
      boxShadow: this.computedStyle.boxShadow
    }
  }
}
</script>
