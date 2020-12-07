<template>
  <div>
    <div
      v-for="category in categories"
      :key="category.name"
      @mouseenter="hoverId = category.name"
      @mouseleave="hoverId = null"
    >
      <div
        :key="category.name"
        :class="{ active: currentCategoryName === category.name }"
        class="button"
        @click="$emit('input', category)"
      >
        <span class="title">
          {{ humanize(category.name) }}
        </span>

        <i
          v-if="currentCategoryName === category.name || hoverId === category.name"
          class="el-icon-arrow-right absolute"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { humanize } from '@/utils/string'

const LOCAL_PAGES = 'localPages'
const PUBLIC_PAGES = 'publicPages'
const ELEMENTS = 'elements'

export { LOCAL_PAGES, PUBLIC_PAGES, ELEMENTS }

export default {
  name: 'MenuCategories',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      hoverId: null
    }
  },
  computed: {
    currentCategoryName() {
      if (this.value) {
        return this.value.name
      }
    },
    categories() {
      return [
        {
          name: 'Element'
        },
        {
          name: 'Cover',
          tags: ['cover']
        },
        {
          name: 'Cover',
          tags: ['cover']
        },
        {
          name: 'About',
          tags: ['about']
        },
        {
          name: 'Title',
          tags: ['title']
        },
        {
          name: 'Gallery',
          tags: ['gallery']
        },
        {
          name: 'Service',
          tags: ['iframer']
        },
        {
          name: 'Layout',
          tags: ['layout']
        },
        {
          name: 'Resume',
          tags: ['resume']
        },
        {
          name: 'Landing Page',
          tags: ['landing page']
        }
      ]
    }
  },
  methods: {
    humanize
  }
}
</script>

<style scoped lang="scss">
.el-icon-arrow-right {
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
  color: #989fa5;
  animation: go-right 0.4s ease;
}

@keyframes go-right {
  from {
    transform: translate(-20%, -50%);
  }

  to {
    transform: translate(0, -50%);
  }
}

.button {
  transition: background-color 0.2s;
  position: relative;
  cursor: pointer;
  padding: 10px 15px;
  padding-right: 30px;

  &:hover {
    background-color: rgba(250, 250, 250, 0.92);
  }
  &.active {
    background-color: #f8f8f8;
  }
}
.title {
  color: $color-black;
  display: block;
  font-size: 13px;
}
.subtitle {
  color: #b2b2b2;
  font-size: 12px;
  word-break: break-word;
}
</style>
