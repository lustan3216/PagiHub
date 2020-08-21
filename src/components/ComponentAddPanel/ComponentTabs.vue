<template>
  <div>
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

      <el-col :span="10">
        <select-tag
          :allow-create="false"
          size="small"
          class="w-100"
        />
      </el-col>

      <el-col :span="3">
        <el-button-group class="w-100">
          <el-button
            :type="column === 24 ? 'primary' : ''"
            plain
            size="small"
            @click="column = 24"
          >
            One
          </el-button>
          <el-button
            :type="column === 12 ? 'primary' : ''"
            plain
            size="small"
            @click="column = 12"
          >
            Two
          </el-button>
          <el-button
            :type="column === 8 ? 'primary' : ''"
            plain
            size="small"
            @click="column = 8"
          >
            Three
          </el-button>
        </el-button-group>
      </el-col>

      <el-col
        :span="1"
        class="align-center"
      >
        <tip placement="bottom">
          Try to copy directly the component you want.
        </tip>
      </el-col>
    </el-row>

    <div class="flex">
      <div class="flex1 flex-column">
        <div
          v-for="category in categories"
          class="button"
          @click="currentCategory = category.name"
        >
          <b class="title">{{ humanize(category.name) }}</b>
          <span class="subtitle">{{ category.subtitle }}</span>
        </div>

        <b class="subtitle m-t-20 m-l-10">Quick Select</b>

        <div
          v-for="quickOption in quickOptions"
          class="button"
          @click="quickSelect(quickOption)"
        >
          <b class="title">{{ humanize(quickOption.name) }}</b>
          <span class="subtitle">{{ quickOption.subtitle }}</span>
        </div>
      </div>

      <div
        style="flex: 5"
        class="content"
      >
        <el-row
          :gutter="25"
          type="flex"
          style="flex-wrap: wrap"
        >
          <el-col
            v-for="component in components[currentCategory]"
            :key="component.id"
            :span="column"
            style="margin-bottom: 35px;"
          >
            <component
              :is="whichComponentCart"
              :component="component"
              :max-height="maxHeight"
              @add="addTemplate(component)"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { cloneJson } from '@/utils/tool'
import { humanize, bigCamelCase } from '@/utils/string'
import { isComponentSet } from '@/utils/node'
import SelectTag from '@/components/Components/SelectTag'
import Tip from '@/components/Tutorial/Tip'
import CardBasicComponent from './CardBasicComponent'
import CardLocalComponent from './CardLocalComponent'
import CardPublicComponent from './CardPublicComponent'

export default {
  name: 'ComponentTabs',
  provide() {
    return {
      isExample: true,
      componentSetId: 0
    }
  },
  components: {
    CardBasicComponent,
    CardLocalComponent,
    CardPublicComponent,
    Tip,
    SelectTag
  },
  props: {
    button: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      column: 8,
      currentCategory: 'basicComponent',
      options: [],
      search: ''
    }
  },
  computed: {
    ...mapState('component', ['editingComponentSetId', 'rootComponentSetIds']),
    ...mapState('example', ['basicExamples']),
    whichComponentCart() {
      switch (this.currentCategory) {
        case 'basicComponent':
          return 'CardBasicComponent'
        case 'localComponents':
          return 'CardLocalComponent'
        default:
          return 'CardPublicComponent'
      }
    },
    categories() {
      return [
        {
          name: 'basicComponents',
          subtitle: 'The basic UI kit'
        },
        {
          name: 'localComponents',
          subtitle: "Components you've created"
        },
        {
          name: 'publicComponents',
          subtitle: 'The component publish by other designer'
        }
      ]
    },
    quickOptions() {
      return [
        {
          name: 'Article',
          subtitle: 'Versatile third party service or embed website'
        },
        {
          name: 'Iframer',
          subtitle: 'Can embed versatile third party service or website'
        },
        {
          name: 'Layout',
          subtitle: 'Can embed versatile third party service or website'
        },
        {
          name: 'Resume',
          subtitle: 'Can embed versatile third party service or website'
        },
        {
          name: 'Landing page',
          subtitle: 'Can embed versatile third party service or website'
        }
      ]
    },
    maxHeight() {
      return {
        8: '300px',
        12: '500px',
        24: '700px'
      }[this.column]
    },
    componentsSets() {
      return this.rootComponentSetIds
        .map(id => this.componentsMap[id])
        .filter(node => node.id !== this.editingComponentSetId)
    },
    components() {
      return {
        basicComponent: this.basicExamples,
        localComponents: this.componentsSets,
        publicComponents: []
      }
    }
  },
  methods: {
    humanize,
    isComponentSet,
    addTemplate(template) {
      if (this.currentCategory === 'basicComponent') {
        this.$emit('choose', cloneJson(template))
      }
      else {
        this.$emit('choose', cloneJson(template.children[0]))
      }
    },
    quickSelect() {}
  }
}
</script>

<style scoped lang="scss">
.content {
  overflow-y: scroll;
  height: calc(90vh - 100px);
  padding: 15px;
  border-left: 1px solid $color-grey;
}

::v-deep {
  .el-carousel__container {
    height: 200px !important;
  }
  .vue-grid-layout {
    min-height: 150px;
  }
}

.button {
  transition: background-color 0.2s;
  font-size: 13px;
  cursor: pointer;
  padding: 15px;
  &:hover {
    background-color: #fafafa;
  }
}
.title {
  color: $color-black;
  display: block;
  margin-bottom: 5px;
}
.search {
  padding: 10px;
  border-bottom: 1px solid $color-grey;
}
</style>
