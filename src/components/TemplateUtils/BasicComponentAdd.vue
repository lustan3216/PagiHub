<template>
  <div class="el-dropdown-menu">
    <div class="el-dropdown-menu__item">
      <b-icon-aspect-ratio class="gray-font-2" />
      Container
    </div>

    <div class="el-dropdown-menu__item">
      <b-icon-fonts class="gray-font-2" />
      Text
    </div>
    <div class="el-dropdown-menu__item">
      <b-icon-image class="gray-font-2" />
      Image
    </div>

    <div class="el-dropdown-menu__item">
      <b-icon-layout-sidebar-inset-reverse class="gray-font-2" />
      Carousel
    </div>

    <div class="el-dropdown-menu__item">
      <b-icon-camera-video class="gray-font-2" />
      Video
    </div>

    <div class="el-dropdown-menu__item">
      <b-icon-link class="gray-font-2" />
      Button
    </div>

    <div class="el-dropdown-menu__item">
      <b-icon-calendar3-event class="gray-font-2" />
      Iframer
    </div>
  </div>
</template>

<script>
import {
  BIconFonts,
  BIconImage,
  BIconAspectRatio,
  BIconColumns,
  BIconCameraVideo,
  BIconCalendar3Event,
  BIconLayoutSidebarInsetReverse,
  BIconLink
} from 'bootstrap-vue'
export default {
  name: 'BasicComponentAdd',
  components: {
    BIconFonts,
    BIconImage,
    BIconAspectRatio,
    BIconColumns,
    BIconCameraVideo,
    BIconCalendar3Event,
    BIconLayoutSidebarInsetReverse,
    BIconLink
  }
}
</script>

<style scoped lang="scss"></style>
