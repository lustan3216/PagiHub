<template>
  <div
    v-if="show"
    :id="`example-${component.id}`"
    class="card"
  >
    <div class="p-10 justify-between">
      <span style="visibility: hidden">ADD</span>
      <b style="line-height: 28px;">
        {{ shortTagName(component) }}
      </b>

      <el-button @click="$emit('add')">
        ADD
      </el-button>
    </div>

    <div class="relative z-index1 p-1 example-boundary">
      <component-giver
        :id="component.id"
        :style="{
          maxHeight
        }"
        class="example"
        @scroll.passive.native="onScroll"
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
import { shortTagName } from '@/utils/node'
import ComponentGiver from '../TemplateUtils/ComponentGiver'
import { Tag } from 'element-ui'
import gsap from 'gsap'
import { mapActions } from 'vuex'

export default {
  name: 'ComponentCard',
  components: {
    ComponentGiver,
    ElTag: Tag
  },
  props: {
    delay: {
      type: Number,
      required: true
    },
    component: {
      type: Object,
      required: true
    },
    maxHeight: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      show: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.show = true
      this.$nextTick(() => {
        gsap.from(this.$el, {
          opacity: 0,
          duration: 3,
          ease: 'elastic'
        })
      })
    }, this.delay)
  },
  methods: {
    ...mapActions('app', ['checkIsGridResizing']),
    shortTagName,
    onScroll() {
      this.checkIsGridResizing()
    }
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
