<template>
  <single-collapse title="BACKGROUND IMAGE">
    <background-size />
    <background-position />
    <background-repeat />
    <background-attachment />
  </single-collapse>
</template>

<script>
import SingleCollapse from '@/components/Components/SingleCollapse'
import BackgroundSize from '@/components/Setup/EditorStyle/BackgroundSize'
import BackgroundPosition from '@/components/Setup/EditorStyle/BackgroundPosition'
import BackgroundRepeat from '@/components/Setup/EditorStyle/BackgroundRepeat'
import BackgroundAttachment from '@/components/Setup/EditorStyle/BackgroundAttachment'

export default {
  name: 'BackgroundImage',
  components: {
    SingleCollapse,
    BackgroundSize,
    BackgroundPosition,
    BackgroundRepeat,
    BackgroundAttachment
  }
}
</script>
