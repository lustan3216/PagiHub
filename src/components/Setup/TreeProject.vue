<template>
  <div class="p-r-10">
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
      size="small"
      class="m-b-10 transparent"
    />
    <el-tree
      ref="tree"
      :data="tree"
      :filter-node-method="filterTagBySearching"
      :indent="16"
      :allow-drop="allowDrop"
      class="tree"
      node-key="id"
      draggable
      check-strictly
      @node-drop="nodeParentChange"
    >
      <span
        slot-scope="{ data }"
        class="justify-between align-center w-100"
        @click="() => nodeClick(data)"
      >
        <span class="el-tree-node__label m-r-10">
          <i
            v-if="TYPE.PROJECT === data.type"
            class="el-icon-files"
          />
          <i
            v-if="TYPE.FOLDER === data.type"
            class="el-icon-folder-opened"
          />
          <i
            v-if="TYPE.COMPONENT_SET === data.type"
            class="el-icon-lollipop"
          />
          {{ data.name }} {{ data.id }}
        </span>

        <span>
          <dialog-folder
            v-if="[PROJECT, FOLDER].includes(data.type)"
            :parent-id="data.id"
            class="m-l-5"
          />

          <dialog-component-set
            v-if="[PROJECT, FOLDER].includes(data.type)"
            :parent-id="data.id"
            class="m-l-5"
          />

          <dialog-delete
            :id="data.id"
            class="m-l-5"
          />

          <component
            :id="data.id"
            :parent-id="data.parentId"
            :is="`dialog-${TYPE_STRING[data.type].kebabCase()}`"
            class="m-l-5"
          />
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { mapActions, mapGetters } from 'vuex'
import { TYPE, TYPE_STRING } from '../../const'
import DialogProject from './DialogProject'
import DialogFolder from './DialogFolder'
import DialogComponentSet from './DialogComponentSet'
import DialogDelete from './DialogDelete'

export default {
  name: 'TreeProject',
  components: {
    ElTree: Tree,
    DialogComponentSet,
    DialogProject,
    DialogFolder,
    DialogDelete
  },
  data() {
    return {
      filterText: '',
      TYPE,
      TYPE_STRING,
      ...TYPE
    }
  },
  computed: {
    ...mapGetters('project', ['tree'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    ...mapActions('project', ['modifyProjectNodeParent']),
    nodeParentChange({ data: childData }, { data: parentData }, action) {
      if (action === 'inner') {
        this.modifyProjectNodeParent({
          parentId: parentData.id,
          id: childData.id
        })
      }
    },
    nodeClick(node) {
      if (TYPE.COMPONENT_SET === node.type) {
        this.setComponent(node.id)
      }
    },
    allowDrop(_, { data: dropData }, action) {
      return (
        action === 'inner' &&
        [TYPE.FOLDER, TYPE.PROJECT].includes(dropData.type)
      )
    },
    filterTagBySearching(value, data) {
      value = value.toLowerCase().toString()
      return data.name.toLowerCase().indexOf(value) !== -1
    }
  }
}
</script>

<style scoped lang="scss">
.tree {
  background: transparent;
  overflow: scroll;
}

::v-deep.el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border-color: transparent;
  color: #c0c4cc;
}
</style>
