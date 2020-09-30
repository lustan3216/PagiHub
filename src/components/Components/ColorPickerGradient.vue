<template>
  <div class="gpickr" />
</template>

<script>
import GPickr from '@/vendor/gpickr/js/gpickr'

export default {
  name: 'ElColorPicker',

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  data() {
    return {
      pickr: null
    }
  },

  mounted() {
    this.pickr = new GPickr({
      el: '.gpickr',
      gradient: true,
      stops: [
        ['rgb(255,132,109)', 0],
        ['rgb(255,136,230)', 1]
      ]
    })
  }
}
</script>
