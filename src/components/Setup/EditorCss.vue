<template>
  <span>

    <dialog-interacted v-if="isVisible" class="dialog white-back box-shadow">
      <div>
        <editor-text :is-draft="true" />
      </div>
    </dialog-interacted>
  </span>
</template>

<script>
import { isMac } from '../../utils/device'
import EditorText from '../Templates/EditorText'
import DialogInteracted from '../Components/DialogInteracted'
export default {
  name: 'EditorCss',
  components: {
    EditorText,
    DialogInteracted
  },
  data() {
    return {
      isVisible: false
    }
  },
  methods: {
    isMac
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  width: 70vw;
  height: 70vh;
  transform: translate(-50%, -50%);
  z-index: 200 !important;
  left: 50%;
  top: 50%;
}
</style>
