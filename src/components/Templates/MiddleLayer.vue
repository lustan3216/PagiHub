<template>
  <div
    :class="[elevate ? 'elevate' : '', 'h-100', 'layer']"
    @mouseover.stop="setCurrentKey"
  >
    <slot />
  </div>
</template>

<script>
import globalStatus from '../../observable/globalStatus'

export default {
  name: 'MiddleLayer',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    elevate() {
      return globalStatus.elevateId === this.id
    }
  },
  methods: {
    setCurrentKey() {
      globalStatus.elevateId = this.id
    }
  }
}
</script>

<style scoped lang="scss">
.layer {
  transition: box-shadow 0.6s, border-color 0.6s;
}
</style>
