<template>
  <div
    v-if="show"
    :id="`example-${component.id}`"
  >
    <div class="p-10 justify-between">
      <span style="visibility: hidden">ADD</span>
      <b style="line-height: 28px;">
        {{ shortTagName(component) }}
      </b>

      <el-button
        :disabled="canNotAdd"
        type="primary"
        data-cy="add-component-button"
        @click="$emit('add')"
      >
        ADD
      </el-button>
    </div>

    <div class="relative z-index1 p-1">
      <art-board
        :id="id"
        class="outer"
      />
    </div>

    <div
      v-if="component.tags && component.tags.length"
      style="margin-top: 20px;"
    >
      <b class="title">Tags</b>

      <el-tag
        v-for="tag in component.tags"
        :key="tag"
        effect="plain"
        class="m-r-5"
      >
        {{ tag }}
      </el-tag>
    </div>

    <div
      v-if="component.description"
      style="margin-top: 20px;"
    >
      <b class="title">Description</b>

      <p v-html="component.description" />
    </div>
  </div>
</template>

<script>
import { shortTagName, getNode, isComponentSet } from '@/utils/node'
import ArtBoard from '../Layout/ArtBoard'
import { Tag } from 'element-ui'
import gsap from 'gsap'
import { mapState } from 'vuex'

export default {
  name: 'CardExample',
  components: {
    ArtBoard,
    ElTag: Tag
  },
  props: {
    id: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    ...mapState('app', ['beingAddedComponentId']),
    component() {
      return getNode(this.id)
    },
    node() {
      return getNode(this.beingAddedComponentId)
    },
    canNotAdd() {
      return isComponentSet(this.node)
    }
  },
  mounted() {
    setTimeout(() => {
      this.show = true
      this.$nextTick(() => {
        gsap.fromTo(
          this.$el,
          {
            opacity: 0
          },
          {
            opacity: 1,
            duration: 3,
            ease: 'elastic'
          }
        )
      })
    }, this.delay)
  },
  methods: {
    shortTagName
  }
}
</script>

<style scoped lang="scss">
.outer {
  padding: 5px;
  height: 200px;
  border-radius: 3px;
  border: 1px solid $color-grey;
}
</style>
