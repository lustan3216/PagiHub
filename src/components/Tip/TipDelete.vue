<template>
  <tip>The design from {{ name }} was reused in other page will not disappear even
    {{ name }} not longer exist.</tip>
</template>

<script>
import Tip from '@/components/Tip/Tip'
export default {
  name: 'TipDelete',
  components: {
    Tip
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  }
}
</script>
