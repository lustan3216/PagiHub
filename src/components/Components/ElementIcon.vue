<script>
import {
  BIconFonts,
  BIconImage,
  BIconSquare,
  BIconCameraVideo,
  BIconCalendar3Event,
  BIconLayoutSidebarReverse,
  BIconLayoutSidebarInsetReverse,
  BIconBox,
  BIconLink,
  BIconAspectRatio
} from 'bootstrap-vue'

export default {
  name: 'ElementIcon',
  functional: true,
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  render(h, context) {
    switch (context.props.icon) {
      case 'flex-section':
        return h(BIconAspectRatio, context.data)
      case 'text-editor':
        return h(BIconFonts, context.data)
      case 'flex-image':
        return h(BIconImage, context.data)
      case 'rectangle':
        return h(BIconSquare, context.data)
      case 'grid-generator-item':
        return h(BIconSquare, context.data)
      case 'grid-generator':
        return h(BIconLayoutSidebarReverse, context.data)
      case 'group':
        return h(BIconBox, context.data)
      case 'slider':
        return h(BIconLayoutSidebarReverse, context.data)
      case 'video-player':
        return h(BIconCameraVideo, context.data)
      case 'iframer':
        return h(BIconCalendar3Event, context.data)
      case 'carousel':
        return h(BIconLayoutSidebarInsetReverse, context.data)
      case 'flex-button':
        return h(BIconLink, context.data)
    }
  }
}
</script>

<style scoped lang="scss"></style>
