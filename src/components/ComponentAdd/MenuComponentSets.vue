<template>
  <div class="wrapper">
    <dynamic-scroller
      v-infinite-scroll="loadMore"
      :items="innerComponents"
      :min-item-size="1"
      class="h-100"
    >
      <template v-slot="{ item, index, active }">
        <dynamic-scroller-item
          :item="item"
          :active="active"
          :size-dependencies="[item.description]"
          :data-index="index"
          :class="{ active: value === item.id }"
          class="button"
          @click.native="$emit('input', item.id)"
          @mouseenter.native="hoverId = item.id"
          @mouseleave.native="hoverId = null"
        >
          <art-board
            :id="item.id"
            style="max-height: 200px;"
            @mousedown.native="mousedown"
          />

        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
  </div>
</template>

<script>
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import ArtBoard from '../Layout/ArtBoard'
import { mapMutations } from 'vuex'
import { searchComponentSets } from '@/api/node'
import { debounce } from '@/utils/tool'
import { PUBLIC_PAGES } from './MenuCategories'
import infiniteScroll from 'vue-infinite-scroll'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

let loading
export default {
  name: 'MenuComponentSets',
  components: {
    ArtBoard,
    DynamicScroller,
    DynamicScrollerItem
  },
  provide() {
    return {
      isExample: true,
      eventController: false
    }
  },
  directives: { infiniteScroll },
  props: {
    value: {
      type: String,
      default: null
    },
    category: {
      type: Object,
      default: null
    },
    text: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default: () => []
    },
    defaultTags: {
      type: Array,
      default: () => []
    },
    exceptIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hoverId: null,
      innerComponents: [],
      currentSize: 0,
      totalValue: 0,
      loading: false
    }
  },
  computed: {
    currentCategoryName() {
      if (this.category) {
        return this.category.name
      }
    },
    isPublic() {
      return this.category.name === PUBLIC_PAGES
    }
  },
  watch: {
    category: {
      handler() {
        this.initSearch()
      },
      immediate: true
    },
    tags() {
      this.initSearch()
    },
    text() {
      this.initSearch()
    },
    innerComponents: {
      handler(value) {
        this.$emit('input', value[0] ? value[0].id : null)
      }
    },
    loading(value) {
      if (value) {
        loading = this.$loading({ target: this.$el })
      }
      else {
        loading.close()
      }
    }
  },
  activated() {
    this.initSearch()
  },
  methods: {
    ...mapMutations('node', ['SET_NODES_TO_MAP']),
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    mousedown(event) {
      this.$bus.$emit('asdd', event.target.getBoundingClientRect())
      this.APP_SET({ isAdding: true })
    },
    initSearch: debounce(async function() {
      this.currentSize = 0

      this.loading = true
      const { data } = await searchComponentSets({
        size: 20,
        from: 0,
        text: this.text,
        tags: [...this.defaultTags, ...this.tags],
        except: this.exceptIds,
        isPublic: this.isPublic
      })
      this.loading = false
      this.SET_NODES_TO_MAP({ nodes: data.data })
      this.currentSize += data.data.length
      this.innerComponents = data.data
      this.totalValue = data.pagination.total
    }, 200),
    async loadMore() {
      if (this.currentSize >= this.totalValue) {
        return
      }

      this.loading = true
      const { data } = await searchComponentSets({
        size: 20,
        from: this.currentSize,
        text: this.text,
        tags: [...this.defaultTags, ...this.tags],
        except: this.exceptIds,
        isPublic: this.isPublic
      })

      this.loading = false
      this.SET_NODES_TO_MAP({ nodes: data.data })
      this.currentSize += data.data.length
      this.innerComponents.push(...data.data)
      this.totalValue = data.pagination.total
    }
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
  position: relative;
  cursor: pointer;
  padding: 15px;

}
.title {
  color: $color-black;
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  padding-top: 10px;
}
.subtitle {
  color: #b2b2b2;
  font-size: 12px;
  word-break: break-word;
}
.scroller {
  height: 100%;
}

.wrapper {
  border-left: 1px solid #f1f1f1;
}
</style>
