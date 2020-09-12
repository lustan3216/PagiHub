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
          size="small"
          class="w-100"
        />
      </el-col>

      <el-col :span="3">
        <el-button-group>
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
        :span="2"
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
          :key="category.name"
          :class="{ active: currentCategory === category.name }"
          class="button"
          @click="currentCategory = category.name"
        >
          <b class="title">{{ humanize(category.name) }}</b>
          <span class="subtitle">{{ category.subtitle }}</span>
        </div>

        <b class="subtitle m-t-20 m-l-10">Quick Select</b>

        <div
          v-for="quickOption in quickOptions"
          :key="quickOption.name"
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
            v-for="(component, index) in components[currentCategory]"
            :key="component.id"
            :span="column"
            style="margin-bottom: 35px;"
          >
            <component-card
              :delay="index * 100"
              :component="component"
              :max-height="maxHeight"
              @add="addTemplate(component)"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { cloneJson } from '@/utils/tool'
import { humanize } from '@/utils/string'
import { isComponentSet } from '@/utils/node'
import SelectTag from '@/components/Components/SelectTag'
import Tip from '@/components/Tutorial/Tip'
import ComponentCard from './ComponentCard'
import CardLocalComponent from './CardLocalComponent'
import CardPublicComponent from './CardPublicComponent'
import { vmGet } from '@/utils/vmMap'
import { STYLES } from '@/const'

export default {
  name: 'DialogComponentTabs',
  provide() {
    return {
      isExample: this.isExample
    }
  },
  components: {
    ComponentCard,
    CardLocalComponent,
    CardPublicComponent,
    Tip,
    SelectTag
  },
  data() {
    return {
      isExample: true,
      column: 8,
      currentCategory: 'basicComponents',
      options: [],
      search: ''
    }
  },
  computed: {
    ...mapState('node', ['editingComponentSetId', 'rootComponentSetIds']),
    ...mapState('example', ['basicExamples']),
    ...mapState('app', ['beingAddedComponentId']),
    categories() {
      return [
        {
          name: 'basicComponents',
          subtitle: 'The basic UI kit'
        },
        {
          name: 'localDesigns',
          subtitle: "Components you've created"
        },
        {
          name: 'publicDesigns',
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
        .map(id => this.nodesMap[id])
        .filter(node => node.id !== this.editingComponentSetId)
    },
    components() {
      return Object.freeze({
        basicComponents: this.basicExamples,
        localDesigns: this.componentsSets,
        publicDesigns: []
      })
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    ...mapActions('app', ['removeBeingAddedComponentId']),
    humanize,
    isComponentSet,
    addTemplate(template) {
      const node = this.nodesMap[this.beingAddedComponentId]

      if (isComponentSet(template)) {
        // 為了不拿到componentSet
        template = template.children[0]

        this.RECORD({
          path: `${node.id}.${STYLES}.default.overflow`,
          value: 'scroll'
        })
      }

      vmGet(node.id).addNodeToParent(cloneJson(template))
      this.$dialog.close()
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

.button {
  transition: background-color 0.2s;

  cursor: pointer;
  padding: 15px;
  &:hover {
    background-color: #fafafa;
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
</style>
