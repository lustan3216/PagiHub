<template>
  <el-tabs
    id="component-tabs"
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
              <async-component
                :id="component.id"
                class="over-hidden"
              />
            </div>

            <div v-if="component.tags && component.tags.length">
              <el-tag
                v-for="tag in component.tags"
                :key="tag"
                effect="plain"
                class="m-r-5"
              >
                {{ tag }}
              </el-tag>
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
import { isComponentSet, shortTagName } from '@/utils/node'
import AsyncComponent from './AsyncComponent'
import { Card, Tag } from 'element-ui'

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
    ElCard: Card,
    ElTag: Tag
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
      categories: ['basic', 'myComponents', 'componentsHub']
    }
  },
  computed: {
    ...mapState('component', ['editingComponentSetId', 'rootComponentSetIds']),
    ...mapState('example', ['basicExamples']),
    componentsSets() {
      return this.rootComponentSetIds
        .map(id => this.componentsMap[id])
        .filter(node => node.id !== this.editingComponentSetId)
    },
    components() {
      return {
        basic: this.basicExamples,
        myComponents: this.componentsSets,
        componentsHub: []
      }
    }
  },
  methods: {
    humanize,
    shortTagName,
    isComponentSet,
    addTemplate(template) {
      if (this.currentCategory === 'basic') {
        this.$emit('choose', cloneJson(template))
      }
      else {
        this.$emit('choose', cloneJson(template.children[0]))
      }
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
