<template>
  <el-tabs
    v-model="currentCategory"
    class="tabs no-select"
    tab-position="left"
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
        :gutter="25"
        type="flex"
        style="flex-wrap: wrap"
      >
        <el-col
          v-for="component in components[category]"
          :key="component.id"
          :span="8"
          style="margin-bottom: 35px;"
        >
          <div class="card">
            <div class="p-10 justify-between">
              <span>
                {{ shortTagName(component) }}
              </span>

              <el-button @click="addTemplate(component)">
                ADD
              </el-button>
            </div>

            <div class="relative z-index1">
              <component
                :is="
                  isComponentSet(component)
                    ? 'component-set'
                    : 'async-component'
                "
                :id="component.id"
              />
            </div>
          </div>
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
      categories: ['basic', 'My', 'search']
    }
  },
  computed: {
    ...mapState('component', ['editingComponentSetId']),
    ...mapState('example', ['basicExamples']),
    componentsSets() {
      return Object.values(this.componentsMap).filter(
        node => isComponentSet(node) && node.id !== this.editingComponentSetId
      )
    },
    components() {
      return {
        basic: this.basicExamples,
        MyComponent: this.componentsSets,
        search: []
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
    height: calc(100vh - 100px);
  }

  & > div > .el-tabs__nav-wrap {
    margin-left: auto;
    margin-right: auto;
  }
}

::v-deep {
  .el-carousel__container {
    height: 200px !important;
  }
  .vue-grid-layout {
    min-height: 150px;
  }
}

.card {
  border: 1px solid $color-grey;
  border-radius: 5px;
  height: 100%;
  padding: 0 10px 10px;
}
</style>
