<template>
  <div class="h-100">
    <dynamic-scroller
      v-infinite-scroll="loadMore"
      v-show="innerComponents.length"
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
          <b class="title">{{ shortTagName(item) }}</b>

          <div
            :max-lines="3"
            class="subtitle"
            autoresize
          >
            {{ item.projectLabel }}
          </div>

          <!--          <el-button-->
          <!--            v-if="hoverId === item.id"-->
          <!--            type="primary"-->
          <!--            style="color: white;"-->
          <!--            class="float-icon z-index1"-->
          <!--            @click.stop="$emit('add', item)"-->
          <!--          >-->
          <!--            ADD-->
          <!--          </el-button>-->

          <i
            v-if="value === item.id || hoverId === item.id"
            class="el-icon-arrow-right absolute"
          />
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
    <div
      v-show="!innerComponents.length"
      class="h-100 flex-center"
    >
      <p>No page</p>
    </div>
  </div>
</template>

<script>
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import VClamp from 'vue-clamp'
import { shortTagName } from '@/utils/node'
import { mapMutations } from 'vuex'
import { searchComponentSets } from '@/api/node'
import { debounce } from '@/utils/tool'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { PUBLIC_PAGES } from './MenuCategories'
import infiniteScroll from 'vue-infinite-scroll'

let loading
export default {
  name: 'MenuComponentSets',
  components: {
    VClamp,
    DynamicScroller,
    DynamicScrollerItem
  },
  directives: { infiniteScroll },
  props: {
    value: {
      type: String,
      default: null
    },
    category: {
      type: String,
      required: true
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
    isPublic() {
      return this.category === PUBLIC_PAGES
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
  methods: {
    ...mapMutations('node', ['SET_NODES_TO_MAP']),
    shortTagName,
    // description(component) {
    //   const div = document.createElement('div')
    //   div.innerHTML = component.description
    //   return div.textContent || div.innerText || ''
    // },
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
.scroller {
  height: 100%;
}
</style>
