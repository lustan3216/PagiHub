<template>
  <div class="controller-wrapper flex">
    <el-tooltip
      effect="light"
      content="Close Preview"
      placement="bottom"
    >
      <el-button
        v-shortkey="['esc']"
        icon="el-icon-close"
        circle
        class="close"
        @click="SET_DRAFT_MODE"
        @shortkey.native="SET_DRAFT_MODE"
      />
    </el-tooltip>

    <portal-target
      name="ViewPortController"
      class="align-center controller"
    />
  </div>
</template>

<script>
import interactjs from 'interactjs'
import { setTransform } from '@/utils/style'
import { mapMutations } from 'vuex'

export default {
  name: 'PreviewController',
  mounted() {
    interactjs(this.$el).draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      modifiers: [
        interactjs.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      // enable autoScroll
      autoScroll: true,

      listeners: {
        // call this function on every dragmove event
        move(event) {
          const target = event.target
          // keep the dragged position in the data-x/data-y attributes
          let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
          let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
          x = parseInt(x)
          y = parseInt(y)

          // translate the element
          Object.assign(
            target.style,
            setTransform({
              top: y,
              left: x
            })
          )

          // update the posiion attributes
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        }
      }
    })
  },
  methods: {
    ...mapMutations('mode', ['SET_DRAFT_MODE'])
  }
}
</script>

<style scoped lang="scss">
.controller-wrapper {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 4px 22px;
  background-color: rgba(253, 253, 253, 0.85);
}
.controller {
  padding-right: 20px;
  border-radius: 50px;
}

.close {
  height: 42px;
  width: 42px;
  border: none;
  background-color: #f9f9f9;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
