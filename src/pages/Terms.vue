<template>
  <panel-production
    first-path="terms"
  />
</template>

<script>
import PanelProduction from '@/components/Layout/PanelProduction'
export default {
  name: 'Terms',
  components: {
    PanelProduction
  },
  created() {
    console.log(123)
  }
}
</script>

<style scoped lang="scss"></style>
