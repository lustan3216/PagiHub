<template>
  <portal to="App">
    <div :style="style">
      <slot/>
    </div>
  </portal>
</template>

<script>
  export default {
    name: 'SendToTop',
    computed: {
      style() {
        return {

        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
