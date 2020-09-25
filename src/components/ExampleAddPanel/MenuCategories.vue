<template>
  <div>
    <div
      v-for="category in categories"
      @mouseenter="hoverId = category.name"
      @mouseleave="hoverId = null"
    >
      <b
        v-if="category.divider"
        :key="category.name"
        class="subtitle m-t-20 m-l-10"
      >
        {{ humanize(category.name) }}
      </b>
      <div
        v-else
        :key="category.name"
        :class="{ active: value === category.name }"
        class="button"
        @click="$emit('input', category.name)"
      >
        <b class="title">{{ humanize(category.name) }}</b>
        <span class="subtitle">{{ category.subtitle }}</span>

        <i
          v-if="value === category.name || hoverId === category.name"
          class="el-icon-arrow-right absolute"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { humanize } from '@/utils/string'

const BASIC_COMPONENTS = 'basicComponents'
const LOCAL_PAGES = 'localPages'
const PUBLIC_PAGES = 'publicPages'

export {
  BASIC_COMPONENTS,
  LOCAL_PAGES,
  PUBLIC_PAGES
}

export default {
  name: 'MenuCategories',
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      hoverId: null
    }
  },
  computed: {
    categories() {
      return [
        {
          name: BASIC_COMPONENTS,
          subtitle: 'The basic UI kit'
        },
        {
          name: LOCAL_PAGES,
          subtitle: "Components you've created"
        },
        {
          name: PUBLIC_PAGES,
          subtitle: 'The component publish by other designer'
        },
        {
          divider: true,
          name: 'quickSelect'
        },
        {
          name: 'Article',
          subtitle: 'Versatile third party service or embed website'
        },
        {
          name: 'Iframer',
          subtitle: 'Can embed versatile third party service or website'
        },
        {
          name: 'Layout',
          subtitle: 'Can embed versatile third party service or website'
        },
        {
          name: 'Resume',
          subtitle: 'Can embed versatile third party service or website'
        },
        {
          name: 'Landing page',
          subtitle: 'Can embed versatile third party service or website'
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
  padding: 15px;
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
  margin-bottom: 5px;
  font-size: 13px;
}
.subtitle {
  color: #b2b2b2;
  font-size: 12px;
  word-break: break-word;
}
</style>
