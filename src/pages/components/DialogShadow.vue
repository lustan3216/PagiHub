<template>
  <div class="cover">
    <div class="block shadow-2">
      <el-button
        v-if="canClose"
        class="close"
        type="text"
        icon="el-icon-close"
        @click="$dialog.close"
      />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogShadow',
  props: {
    canClose: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    '$route.path'(value) {
      this.$dialog.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
  text-align: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100000;
  background: #fdfbfb; /* Old browsers */
  background: -moz-linear-gradient(
    to bottom,
    rgba(253, 251, 251, 0.95) 0%,
    rgba(235, 237, 238, 0.95) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    to bottom,
    rgba(253, 251, 251, 0.95) 0%,
    rgba(235, 237, 238, 0.95) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    rgba(253, 251, 251, 0.95) 0%,
    rgba(235, 237, 238, 0.95) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fdfbfb', endColorstr='#ebedee',GradientType=0 ); /* IE6-9 */
}
.block {
  position: absolute;
  z-index: 1;
  width: 50vw;
  max-width: 600px;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  background: $color-white;
  opacity: 0.95;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 1px solid rgba(243, 247, 250, 0.05);
}

.close {
  position: absolute;
  top: 10px;
  right: 40px;
  font-size: 30px;
  width: 40px;
  height: 40px;
  padding: 15px 12px 12px 15px;
  color: $color-black;
}
</style>
