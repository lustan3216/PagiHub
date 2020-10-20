<template>
  <el-dialog
    id="examples-dialog"
    ref="dialog"
    :class="currentCategory"
    :visible="visible"
    class="dialog"
    top="5vh"
    width="80vw"
    @close="removeBeingAddedComponentId"
  >
    <el-row
      :gutter="10"
      type="flex"
      class="search"
    >
      <el-col :span="6">
        <el-input
          v-model="search"
          placeholder="Search name or description"
          size="small"
          clearable
        />
      </el-col>

      <el-col :span="9">
        <select-tag
          :disabled="isBasic || isAsset"
          v-model="tags"
          :allow-create="false"
          placeholder="Select tags to search"
          size="small"
          class="w-100"
        />
      </el-col>
    </el-row>

    <div
      class="flex"
      style="height: 83vh;"
    >
      <menu-categories
        v-model="currentCategory"
        class="flex-column over-scroll"
        style="width: 225px;"
      />

      <keep-alive>
        <menu-examples
          v-if="isBasic"
          :search="search"
          style="flex: 7.5"
          class="over-scroll p-15"
          @add="addTemplate"
        />

        <menu-images
          v-else-if="isAsset"
          :search="search"
          style="flex: 7.5"
          @uploading="$emit('uploading')"
          @uploaded="$emit('uploaded')"
          @add="addTemplate"
        />

        <menu-component-sets
          v-else
          v-model="currentComponentId"
          :except-ids="[editingComponentSetId]"
          :category="currentCategory.name"
          :key="currentCategory.name"
          :text="search"
          :tags="tags"
          :default-tags="defaultTags"
          class="flex-column over-scroll"
          style="flex: 1.5;"
          @add="addTemplate"
        />
      </keep-alive>

      <div
        v-if="!isBasic && !isAsset"
        style="flex: 6"
        class="content"
      >
        <card-component-set
          v-if="currentComponentId"
          :id="currentComponentId"
          @add="addTemplate"
        />

        <div
          v-else
          class="flex-center h-100"
        >
          <p>Please select a page to review</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { cloneJson } from '@/utils/tool'
import { isComponent, isComponentSet, isGridItem } from '@/utils/node'
import { Tag } from 'element-ui'
import { vmGet, vmRemoveNode } from '@/utils/vmMap'
import { HTML, STYLES } from '@/const'
import Tip from '@/components/Tip/TipPopper'
import SelectTag from '@/components/Components/SelectTag'
import CardComponentSet from './CardComponentSet'
import MenuCategories, { BASIC_COMPONENTS, IMAGE_ASSET } from './MenuCategories'
import MenuComponentSets from './MenuComponentSets'
import MenuExamples from './MenuExamples'
import MenuImages from './MenuImages'

export default {
  name: 'DialogComponentTabs',
  provide() {
    return {
      isExample: true
    }
  },
  components: {
    MenuExamples,
    MenuCategories,
    MenuComponentSets,
    MenuImages,
    CardComponentSet,
    Tip,
    SelectTag,
    ElTag: Tag
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentCategory: { name: BASIC_COMPONENTS },
      currentComponentId: null,
      search: '',
      tags: [],
      defaultTags: []
    }
  },
  computed: {
    ...mapState('node', ['editingComponentSetId', 'rootComponentSetIds']),
    ...mapState('app', ['beingAddedComponentId']),
    isBasic() {
      return this.currentCategory.name === BASIC_COMPONENTS
    },
    isAsset() {
      return this.currentCategory.name === IMAGE_ASSET
    }
  },
  watch: {
    currentCategory(value) {
      this.defaultTags = value.tags || []
      this.resizeNodeQuickFn()
    },
    currentComponentId() {
      this.resizeNodeQuickFn()
    }
  },
  mounted() {
    this.$bus.$on('dialog-component-tabs-jump', this.chooseCategory)
  },
  beforeDestroy() {
    this.$bus.$off('dialog-component-tabs-jump', this.chooseCategory)
  },
  methods: {
    ...mapActions('node', ['record']),
    ...mapActions('app', ['removeBeingAddedComponentId']),
    ...mapActions('layout', ['resizeNodeQuickFn']),
    chooseCategory(category) {
      this.currentCategory = { name: category }
    },
    addTemplate(template) {
      const node = this.nodesMap[this.beingAddedComponentId]

      if (isComponentSet(template)) {
        // 為了不拿到componentSet
        template = template.children[0]

        this.record({
          path: `${node.id}.${STYLES}.${HTML}.overflow`,
          value: 'scroll'
        })

        vmGet(node.id).addNodeToParent(cloneJson(template))
        this.removeBeingAddedComponentId()
      }
      else if (isGridItem(template)) {
        vmGet(node.id).addNodeToParent(cloneJson(template))
        this.removeBeingAddedComponentId()
      }
      else if (isComponent(template)) {
        vmRemoveNode(node)
        vmGet(node.parentId).addNodeToParent(cloneJson(template))
        this.removeBeingAddedComponentId()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  overflow-y: scroll;
  height: calc(90vh - 100px);
  padding: 15px;
}

.flex-column {
  border-right: 1px solid $color-grey;
}

::v-deep.basicComponents {
  .el-carousel__container {
    height: 200px !important;
  }
  .vue-grid-layout {
    min-height: 150px;
  }
  .el-dialog__headerbtn {
    z-index: 10;
  }
}

.search {
  padding: 10px;
  border-bottom: 1px solid $color-grey;
  overflow: hidden;
}
.el-button-group {
  width: 100%;
  display: flex;
  & button {
    flex: 1;
  }
}
.dialog,
::v-deep.dialog .el-dialog__header,
::v-deep.dialog .el-dialog__body {
  padding: 0;
}
::v-deep > .el-dialog {
  border-radius: 5px;
  overflow: hidden;
}
::v-deep .el-dialog__headerbtn {
  z-index: 15;
}
.component {
  height: 200px;
}

.outer {
  padding: 5px;
  border-radius: 3px;
  border: 1px solid $color-grey;
}
</style>
