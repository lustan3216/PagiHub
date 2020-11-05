<template>
  <div class="flex-column wh-100">
    <el-tree
      ref="tree"
      :filter-node-method="filterTagBySearching"
      :data="tree"
      :indent="20"
      :allow-drop="allowDrop"
      empty-text="No components"
      class="tree"
      node-key="id"
    >
      <template v-slot="{ data }">
        <div
          v-if="data && data.id"
          :id="`tree-node-${data.id}`"
          :class="{ active: selectedComponentIds.includes(data.id) }"
          class="relative w-100 over-hidden align-center"
          style="margin-left: -6px;"
          @click="nodeClick($event, data.id)"
          @mouseenter.stop="hoverNode(data.id)"
          @mouseleave.stop="hoverLeaveNode(data.id)"
        >
          <hidden
            :id="data.id"
            class="hidden-button"
          />

          <component-name
            :id="data.id"
            :text-show-content="
              ['flex-button', 'text-editor'].includes(data.tag)
            "
            class="text-left"
            editable
          >
            <template slot="icon">
              <element-icon
                :icon="data.tag"
                class="gray-font-2"
              />
            </template>
          </component-name>

          <div
            class="controller"
            style="width: 48px;"
          >
            <visible
              :id="data.id"
              :visible="data.id === hoverId"
              class="absolute icon"
              style="left: 15px;"
            />

            <touchable
              :id="data.id"
              :visible="data.id === hoverId"
              class="icon"
            />
          </div>
        </div>
      </template>
    </el-tree>

    <el-input
      v-shortkey.avoid
      v-model="filterText"
      placeholder="Can search name, type or text"
      size="small"
    />
  </div>
</template>

<script>
import Tree from '@/vendor/element-ui/tree'
import { SOFT_DELETE } from '@/const'
import { mapState, mapMutations, mapActions } from 'vuex'
import { asyncGetValue, cloneJson } from '@/utils/tool'
import ElementIcon from '@/components/Components/ElementIcon'
import ComponentController from '../TemplateUtils/ComponentController'
import ComponentName from '../TemplateUtils/ComponentName'
import Touchable from './EditorStyle/Lock'
import Visible from './EditorStyle/Visible'
import Hidden from './EditorStyle/Hidden'
import {
  traversalSelfAndChildren,
  isSlider,
  isComponentSet,
  traversalAncestorAndSelf,
  isBackground,
  sortDescByZIndex
} from '@/utils/node'
import { vmGet } from '@/utils/vmMap'

require('smoothscroll-polyfill').polyfill()

export default {
  name: 'PanelComponents',
  components: {
    ElTree: Tree,
    ComponentController,
    ComponentName,
    Touchable,
    Visible,
    Hidden,
    ElementIcon
  },
  data() {
    return {
      hoverId: null,
      filterText: '',
      tree: []
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('node', ['editingComponentSetId']),
    componentSetNode() {
      return this.nodesMap[this.editingComponentSetId]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    selectedComponentIds(ids) {
      ids.forEach(id => {
        const treeNode = this.$refs.tree.getNode(id)
        if (treeNode) {
          treeNode.expand(() => {}, true)
        }
      })
    }
  },
  created() {
    this.renderTree()
    this.$bus.$on('component-add-new', this.renderTree)
    this.$bus.$on('component-delete', this.renderTree)
    this.$bus.$on('component-update-zindex', this.renderTree)
  },
  beforeDestroy() {
    this.$bus.$off('component-add-new', this.renderTree)
    this.$bus.$off('component-delete', this.renderTree)
    this.$bus.$off('component-update-zindex', this.renderTree)
  },
  methods: {
    ...mapMutations('app', [
      'TOGGLE_SELECTED_COMPONENT_IN_IDS',
      'TOGGLE_SELECTED_COMPONENT_ID'
    ]),
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    renderTree() {
      const tree = this.componentSetNode

      if (!tree) {
        return
      }

      const cloneTree = cloneJson(tree)

      traversalSelfAndChildren(cloneTree, (node, parentNode) => {
        if (isBackground(node)) {
          parentNode.children = sortDescByZIndex(node.children)
        }

        node.children = node.children.filter(node => node && !node[SOFT_DELETE])
        node.children = sortDescByZIndex(node.children)
      })

      this.tree = cloneTree.children
    },
    allowDrop(drag, drop, action) {
      const sameLayer = drag.parent === drop.parent
      return sameLayer && ['prev', 'next'].includes(action)
    },
    filterTagBySearching(searchText, { label, tag, value }) {
      searchText = searchText.toLowerCase().toString()
      return `${label}${tag}${value}`.toLowerCase().indexOf(searchText) !== -1
    },
    nodeClick(event, id) {
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault()
        event.stopPropagation()
        this.TOGGLE_SELECTED_COMPONENT_IN_IDS(id)
      }
      else {
        this.TOGGLE_SELECTED_COMPONENT_ID(id)
      }
      this.scrollIntoView(id)
    },
    hoverNode(id) {
      this.hoverId = id
      this.$bus.$emit(`hover-${id}`, true)
    },

    hoverLeaveNode(id) {
      this.hoverId = null
      this.$bus.$emit(`hover-${id}`, false)
    },

    async scrollIntoView(id) {
      const sliders = await this.jumpToCorrectSliders(id)

      if (this.vmMap[id]) {
        // 可能被device hidden 所以map找不到
        setTimeout(
          () => {
            this.vmMap[id].$el.scrollIntoView(false)
          },
          sliders.length ? 100 : 0
        )
      }
    },

    jumpToCorrectSliders(id) {
      return new Promise(resolve => {
        const node = this.nodesMap[id]
        const queue = []

        traversalAncestorAndSelf(node, node => {
          if (isSlider(node)) {
            queue.unshift(node)
          }

          if (isComponentSet(node)) return false
        })

        queue.forEach(async(node, index) => {
          const { $parent: carousel } = await asyncGetValue(() =>
            vmGet(node.parentId)
          )
          carousel.setAnimation(false)
          carousel.setActiveIndex(node.id)

          this.$nextTick(() => {
            carousel.setAnimation(true)
          })

          if (index === queue.length - 1) {
            resolve(queue)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tree {
  overflow: scroll;
  flex: 1;
}
.controller {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 1px;
  text-align: right;
  padding: 0 5px;
}

.active {
  background: #f0f7ff;
}

.small-title {
  display: block;
  margin: 5px 10px;
}
::v-deep {
  .el-button {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .el-tree-node__content {
    height: 30px;
  }
  .el-tree-node__content:hover > * > .controller {
    background: #f5f7fa;
  }
}

.icon {
  font-size: 14px;
}
.hidden-button {
  font-size: 16px;
  margin-left: 8px;
  margin-right: -8px;
}
</style>
