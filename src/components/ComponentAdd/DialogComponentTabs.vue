<template>
  <el-tooltip
    effect="light"
    placement="bottom"
  >
    <div slot="content">
      Shared pages
      <i
        v-shortkey="['s']"
        class="gray-font-2 m-l-10"
        @shortkey="visible = true"
      >
        S
      </i>
    </div>

    <el-button
      type="text"
      @click="visible = !visible"
    >
      <b-icon-files />

      <el-dialog
        ref="dialog"
        :class="currentCategory"
        :visible="visible"
        class="dialog"
        top="5vh"
        append-to-body
        width="95vw"
        @close="visible = false"
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

          <menu-component-sets
            v-model="currentComponentId"
            :except-ids="exceptIds"
            :category="currentCategory.name"
            :key="currentCategory.name"
            :text="search"
            :tags="tags"
            :default-tags="defaultTags"
            class="flex-column over-scroll"
            style="flex: 1.5;"
            @add="addTemplate"
          />

          <div
            style="flex: 6"
            class="content"
          >
            <card-component-set
              v-if="currentComponentId && visible"
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
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { cloneJson } from '@/utils/tool'
import { isComponentSet } from '@/utils/node'
import { Tag } from 'element-ui'
import { vmGet, vmRemoveNode } from '@/utils/vmMap'
import { HTML, STYLES } from '@/const'
import Tip from '@/components/Tip/TipPopper'
import SelectTag from '@/components/Components/SelectTag'
import CardComponentSet from './CardComponentSet'
import { BIconFiles } from 'bootstrap-vue'
import MenuCategories, { LOCAL_PAGES } from './MenuCategories'
import MenuComponentSets from './MenuComponentSets'
import MenuImages from './MenuImages'

export default {
  name: 'DialogComponentTabs',
  provide() {
    return {
      isExample: true
    }
  },
  components: {
    MenuCategories,
    MenuComponentSets,
    MenuImages,
    CardComponentSet,
    BIconFiles,
    Tip,
    SelectTag,
    ElTag: Tag
  },
  data() {
    return {
      currentCategory: { name: LOCAL_PAGES },
      currentComponentId: null,
      search: '',
      tags: [],
      defaultTags: [],
      visible: false
    }
  },
  computed: {
    ...mapState('node', ['editingProjectId']),
    ...mapState('app', ['beingAddedComponentId']),
    exceptIds() {
      const project = this.nodesMap[this.editingProjectId]
      return project ? project.children.map(node => node.id) : []
    }
  },
  watch: {
    currentCategory(value) {
      this.defaultTags = value.tags || []
    },
    visible() {
      this.APP_SET({ selectedComponentIds: [] })
    }
  },
  mounted() {
    this.$bus.$on('dialogComponentVisible', this.setVisible)
  },
  beforeDestroy() {
    this.$bus.$off('dialogComponentVisible', this.setVisible)
  },
  methods: {
    ...mapActions('node', ['debounceRecord']),
    ...mapActions('app', ['removeBeingAddedComponentId']),
    ...mapMutations('app', { APP_SET: 'SET' }),
    setVisible(visible) {
      this.visible = visible
    },
    addTemplate(template) {
      const node = this.nodesMap[this.beingAddedComponentId]

      if (node.tag === template.tag) {
        // when replacing flex-image, no add
        vmRemoveNode(node)
        vmGet(node.parentId).addNodeToParent(cloneJson(template))
      }
      else {
        if (isComponentSet(template)) {
          // 為了不拿到componentSet
          template = template.children[0]

          this.debounceRecord({
            path: `${node.id}.${STYLES}.${HTML}.overflow`,
            value: 'scroll'
          })
        }

        vmGet(node.id).addNodeToParent(cloneJson(template))
      }
      this.removeBeingAddedComponentId()
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
