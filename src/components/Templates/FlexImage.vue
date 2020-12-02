<template>
  <grid-generator-item
    :id="id"
    data-image-droppable
  >
    <div class="el-image wh-100">
      <img
        v-if="base64Image"
        :src="base64Image"
        :style="imageStyle"
        :class="{ 'el-image__inner--center': alignCenter }"
        style="width: 100%;height: 100%;"
      >

      <div
        v-else-if="loading"
        class="el-image__placeholder"
      />
      <div
        v-else-if="error"
        class="el-image__error"
      >{{ innerProps.error }}
      </div>

      <img
        v-else
        :style="imageStyle"
        :class="{ 'el-image__inner--center': alignCenter }"
        :src="innerProps.src"
        class="el-image__inner"
      >
    </div>
  </grid-generator-item>
</template>

<script>
import propsMixin from '@/components/Templates/mixins/props'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexImage'
import GridGeneratorItem from '@/components/Templates/GridGeneratorItem'

const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined

const ObjectFit = {
  NONE: 'none',
  CONTAIN: 'contain',
  COVER: 'cover',
  FILL: 'fill',
  SCALE_DOWN: 'scale-down'
}

export default {
  defaultSetting,
  name: 'FlexImage',
  components: {
    ElImage: Image,
    GridGeneratorItem
  },
  mixins: [propsMixin],
  data() {
    return {
      base64Image: null,
      loading: true,
      error: false,
      imageWidth: 0,
      imageHeight: 0
    }
  },
  computed: {
    fit() {
      return this.innerProps.fit
    },
    imageStyle() {
      const { fit } = this
      if (!this.$isServer && fit) {
        return isSupportObjectFit()
          ? { 'object-fit': fit }
          : this.getImageStyle(fit)
      }
      return {}
    },
    alignCenter() {
      return !this.$isServer && !isSupportObjectFit() && this.fit !== ObjectFit.FILL
    }
  },
  watch: {
    src(val) {
      this.show && this.loadImage()
    },
    show(val) {
      val && this.loadImage()
    }
  },

  mounted() {
    this.loadImage()
  },
  methods: {
    loadImage() {
      if (this.$isServer) return

      // reset status
      this.loading = true
      this.error = false

      const img = new Image()
      img.onload = e => this.handleLoad(e, img)
      img.onerror = this.handleError.bind(this)

      // bind html attrs
      // so it can behave consistently
      Object.keys(this.$attrs)
        .forEach((key) => {
          const value = this.$attrs[key]
          img.setAttribute(key, value)
        })
      img.src = this.innerProps.src
    },
    handleLoad(e, img) {
      this.imageWidth = img.width
      this.imageHeight = img.height
      this.loading = false
      this.error = false
    },
    handleError() {
      this.loading = false
      this.error = true
    },
    setBase64Preview(file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.base64Image = reader.result
      }
      reader.onerror = (error) => {
        throw error
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-image__error, .el-image__placeholder {
    background: #F5F7FA
  }

  .el-image__error, .el-image__inner, .el-image__placeholder {
    width: 100%;
    height: 100%
  }

  .el-image {
    position: relative;
    display: inline-block;
    overflow: hidden
  }

  .el-image__inner {
    vertical-align: top
  }

  .el-image__inner--center {
    position: relative;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: block
  }

  .el-image__error {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: 14px;
    color: #C0C4CC;
    vertical-align: middle
  }

  .el-image__preview {
    cursor: pointer
  }

  .el-image-viewer__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
  }

  .el-image-viewer__btn {
    position: absolute;
    z-index: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 50%;
    opacity: .8;
    cursor: pointer;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none
  }

  .el-image-viewer__close {
    top: 40px;
    right: 40px;
    width: 40px;
    height: 40px;
    font-size: 40px
  }

  .el-image-viewer__canvas {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
  }

  .el-image-viewer__actions {
    left: 50%;
    bottom: 30px;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 282px;
    height: 44px;
    padding: 0 23px;
    background-color: #606266;
    border-color: #FFFFFF;
    border-radius: 22px
  }

  .el-image-viewer__actions__inner {
    width: 100%;
    height: 100%;
    text-align: justify;
    cursor: default;
    font-size: 23px;
    color: #FFFFFF;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: distribute;
    justify-content: space-around
  }

  .el-image-viewer__next, .el-image-viewer__prev {
    top: 50%;
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: #FFFFFF;
    background-color: #606266;
    border-color: #FFFFFF
  }

  .el-image-viewer__prev {
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    left: 40px
  }

  .el-image-viewer__next {
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    right: 40px;
    text-indent: 2px
  }

  .el-image-viewer__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: .5;
    background: #000000
  }

  .viewer-fade-enter-active {
    -webkit-animation: viewer-fade-in .3s;
    animation: viewer-fade-in .3s
  }

  .viewer-fade-leave-active {
    -webkit-animation: viewer-fade-out .3s;
    animation: viewer-fade-out .3s
  }

  @-webkit-keyframes viewer-fade-in {
    0% {
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
    100% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1
    }
  }

  @keyframes viewer-fade-in {
    0% {
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
    100% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1
    }
  }

  @-webkit-keyframes viewer-fade-out {
    0% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1
    }
    100% {
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
  }

  @keyframes viewer-fade-out {
    0% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1
    }
    100% {
      -webkit-transform: translate3d(0, -20px, 0);
      transform: translate3d(0, -20px, 0);
      opacity: 0
    }
  }
</style>
