<template>
  <el-tabs
    v-model="currentCategory"
    class="tabs"
    stretch
  >
    <el-tab-pane
      v-for="category in categories"
      :key="category"
      :name="category"
      :label="humanize(category)"
      lazy
      class="p-10"
    >
      <el-row
        :gutter="15"
        type="flex"
        style="flex-wrap: wrap"
      >
        <el-col
          v-for="component in components[category]"
          :key="component.id"
          :xs="24"
          class="m-b-15"
        >
          <el-card shadow="hover" >
            <el-button type="text">
              {{ shortTagName(component) }}
            </el-button>
            <div
              draggable="true"
              class="relative z-index1 component"
              @dragstart="$event.dataTransfer.setData('id', component.id)"
            >
              <component
                :is="isComponentSet(component) ? 'component-set' : 'async-component'"
                :id="component.id"
                class="no-action"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapState } from 'vuex'
import { cloneJson } from '@/utils/tool'
import { humanize } from '@/utils/string'
import { shortTagName, isComponentSet } from '@/utils/node'
import AsyncComponent from './AsyncComponent'
import ComponentSet from './ComponentSet'
import { Card } from 'element-ui'
import { NODE_TYPE } from '@/const'

export default {
  name: 'ComponentTabs',
  provide() {
    return {
      isExample: true,
      componentSetId: 0
    }
  },
  components: {
    AsyncComponent,
    ComponentSet,
    ElCard: Card
  },
  props: {
    button: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentCategory: 'basic',
      options: [],
      search: '',
      categories: ['basic', 'currentProject', 'all']
    }
  },
  computed: {
    ...mapState('project', ['projectMap']),
    ...mapState('component', ['basicExamples', 'editingComponentSetId']),
    componentsSets() {
      return Object.values(this.projectMap)
        .filter(node => NODE_TYPE.COMPONENT_SET === node.type && node.id !== this.editingComponentSetId)
    },
    components() {
      return {
        basic: this.basicExamples,
        currentProject: this.componentsSets,
        all: this.basicExamples
      }
    }
  },
  methods: {
    humanize,
    isComponentSet,
    shortTagName,
    addTemplate(template) {
      this.$emit('choose', cloneJson(template))
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep.tabs {
    & > .el-tabs__content {
      overflow: scroll;
      height: calc(100vh - 70px);
    }

    & > div > .el-tabs__nav-wrap {
      width: 250px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  ::v-deep {
    .el-card__body {
      padding: 0 10px 10px;
    }

    .el-carousel__container {
      height: 200px !important;
    }
  }

  ::v-deep.dialog > .el-dialog__header {
    padding: 0;
  }
</style>
