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
      <slot/>
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
    background-color: rgba(239, 239, 239, 0.85);
  }
  .block {
    position: absolute;
    z-index: 1;
    width: 50vw;
    max-width: 470px;
    height: 340px;
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
    border: 1px solid rgba(243,247,250,.05);
  }

  .close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 20px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 5px 2px 2px 5px;
    box-shadow:
      -3px -3px 10px rgba(255, 255, 255, 0.72),
      3px 3px 10px rgba(174, 174, 192, 0.4);
  }
</style>
