<template>
  <div>
    <div
      v-for="component in innerComponents"
      :key="component.label"
      :class="{ active: value === component.id }"
      class="button"
      @click="$emit('input', component.id)"
      @mouseenter="hoverId = component.id"
      @mouseleave="hoverId = null"
    >
      <b class="title">{{ shortTagName(component) }}</b>

      <span
        class="subtitle"
        v-html="component.description"
      />

      <el-button
        v-if="hoverId === component.id"
        type="primary"
        style="color: white;"
        class="float-icon z-index1"
        @click.stop="$emit('add', component.id)"
      >ADD</el-button>

      <i
        v-if="value === component.id"
        class="el-icon-arrow-right float-icon"
      />
    </div>
  </div>
</template>

<script>
import { shortTagName } from '@/utils/node'
import { LOCAL_PAGES, PUBLIC_PAGES } from './MenuCategories'
import { mapState } from 'vuex'

export default {
  name: 'MenuComponents',
  props: {
    value: {
      type: String,
      default: null
    },
    category: {
      type: String,
      required: true
    },
    exceptIds: {
      type: Array,
      default: () => []
    },
    components: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hoverId: null
    }
  },
  computed: {
    ...mapState('node', ['rootComponentSetIds']),
    innerComponents() {
      return this[this.category] || this.components
    },
    [LOCAL_PAGES]() {
      const array = []
      this.rootComponentSetIds.forEach(id => {
        if (!this.exceptIds.includes(id)) {
          array.push(this.nodesMap[id])
        }
      })

      return Object.freeze(array)
    },
    [PUBLIC_PAGES]() {
      return Object.freeze([])
    }
  },
  watch: {
    category: {
      handler() {
        if (this.innerComponents) {
          this.$emit('input', this.innerComponents[0].id)
        }
      },
      immediate: true
    }
  },
  methods: {
    shortTagName
  }
}
</script>

<style scoped lang="scss">
.float-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
  color: #989fa5;
  animation: go-right 0.4s ease;
}

@keyframes go-right {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
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
