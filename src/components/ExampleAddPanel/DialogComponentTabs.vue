<template>
  <el-dialog
    id="examples-dialog"
    ref="dialog"
    :class="currentCategory"
    visible
    class="dialog"
    destroy-on-close
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
          :allow-create="false"
          placeholder="Can select multiple tags to search"
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

      <div
        v-if="isBasic"
        style="flex: 7.5"
        class="over-scroll p-15"
      >
        <el-row
          :gutter="25"
          type="flex"
          style="flex-wrap: wrap"
        >
          <el-col
            v-for="(component, index) in basicExamples"
            :key="component.id"
            :span="8"
            style="margin-bottom: 35px;"
          >
            <card-example
              :delay="index * 100"
              :id="component.id"
              @add="addTemplate(component)"
            >
              <component-giver
                :id="component.id"
                class="outer"
              />
            </card-example>
          </el-col>
        </el-row>
      </div>

      <template v-else>
        <menu-components
          v-model="currentComponentId"
          :except-ids="[editingComponentSetId]"
          :category="currentCategory"
          class="flex-column over-scroll"
          style="flex: 1.5;"
        />

        <div
          style="flex: 6"
          class="content"
        >
          <card-component-set
            v-if="currentComponentId"
            :id="currentComponentId"
            :delay="100"
          >
            <art-board
              :id="currentComponentId"
            />
          </card-component-set>
        </div>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { cloneJson } from '@/utils/tool'
import { isComponentSet } from '@/utils/node'
import { Tag } from 'element-ui'
import { vmGet } from '@/utils/vmMap'
import { HTML, STYLES } from '@/const'
import Tip from '@/components/Tutorial/Tip'
import SelectTag from '@/components/Components/SelectTag'
import ComponentGiver from '@/components/TemplateUtils/ComponentGiver'
import CardExample from './CardExample'
import CardComponentSet from './CardComponentSet'
import ArtBoard from '../Layout/ArtBoard'
import MenuCategories, { BASIC_COMPONENTS } from './MenuCategories'
import MenuComponents from './MenuComponents'

export default {
  name: 'DialogComponentTabs',
  provide() {
    return {
      isExample: this.isExample
    }
  },
  components: {
    ArtBoard,
    MenuCategories,
    MenuComponents,
    CardExample,
    CardComponentSet,
    ComponentGiver,
    Tip,
    SelectTag,
    ElTag: Tag
  },
  data() {
    return {
      isExample: true,
      currentCategory: BASIC_COMPONENTS,
      currentComponentId: null,
      options: [],
      search: '',
      reviewingId: null
    }
  },
  computed: {
    ...mapState('node', ['editingComponentSetId', 'rootComponentSetIds']),
    ...mapState('app', ['beingAddedComponentId']),
    ...mapState('example', ['basicExamples']),
    isBasic() {
      return this.currentCategory === 'basicComponents'
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    ...mapActions('app', ['removeBeingAddedComponentId']),
    addTemplate(template) {
      const node = this.nodesMap[this.beingAddedComponentId]

      if (isComponentSet(template)) {
        // 為了不拿到componentSet
        template = template.children[0]

        this.RECORD({
          path: `${node.id}.${STYLES}.${HTML}.overflow`,
          value: 'scroll'
        })
      }

      vmGet(node.id).addNodeToParent(cloneJson(template))
      this.$dialog.close()
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
.component {
  height: 200px;
}

.outer {
  padding: 5px;
  border-radius: 3px;
  border: 1px solid $color-grey;
}
</style>
