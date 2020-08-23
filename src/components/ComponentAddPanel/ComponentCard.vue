<template>
  <div class="card">
    <div class="p-10 justify-between">
      <span style="visibility: hidden">ADD</span>
      <b style="line-height: 28px;">
        {{ shortTagName(component) }}
      </b>

      <el-button @click="$emit('add')">
        ADD
      </el-button>
    </div>

    <div class="relative z-index1 p-1">
      <async-component
        :id="component.id"
        :style="{
          maxHeight
        }"
        class="example"
        @scroll.native="resizeNodeQuickFn"
      />
    </div>

    <div v-if="component.tags && component.tags.length">
      <el-tag
        v-for="tag in component.tags"
        :key="tag"
        effect="plain"
        class="m-r-5"
      >
        {{ tag }}
      </el-tag>
    </div>

    <p v-if="component.description">
      {{ component.description }}
    </p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { shortTagName } from '@/utils/node'
import AsyncComponent from '../TemplateUtils/AsyncComponent'
import { Tag } from 'element-ui'

export default {
  name: 'ComponentCard',
  components: {
    AsyncComponent,
    ElTag: Tag
  },
  props: {
    component: {
      type: Object,
      required: true
    },
    maxHeight: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions('app', ['resizeNodeQuickFn']),
    shortTagName
  }
}
</script>

<style scoped lang="scss">
.card {
  border-radius: 5px;
  height: 100%;
  padding: 0 10px 10px;
}
.example {
  overflow: scroll;
  border: 1px solid $color-grey;
  padding: 5px;
}
</style>
