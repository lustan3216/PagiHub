<template>
  <div>
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
      :expand-on-click-node="false"
      :indent="16"
      :allow-drop="allowDrop"
      class="tree"
      node-key="id"
      draggable
      default-expand-all
      @node-drop="nodeDrop"
    >
      <span
        slot-scope="{ data }"
        class="custom-tree-node justify-between align-center w-100"
        @click="() => nodeClick(data)"
      >
        <span class="el-tree-node__label m-r-10">
          {{ data.name }}
        </span>

        <span>
          <el-button
            v-if="[PROJECT, FOLDER].includes(data.type)"
            icon="el-icon-folder-add"
            type="text"
            size="mini"
            @click.stop="() => addNew(data, FOLDER)"
          />

          <el-button
            v-if="[PROJECT, FOLDER].includes(data.type)"
            type="text"
            icon="el-icon-circle-plus-outline"
            size="mini"
            @click.stop="() => addNew(data, COMPONENT)"
          />

          <el-button
            v-if="[COMPONENT, FOLDER].includes(data.type)"
            type="text"
            icon="el-icon-delete"
            size="mini"
            @click.stop="() => remove(data, data)"
          />

          <el-button
            v-if="[COMPONENT_IS_USED].includes(data.type)"
            type="text"
            icon="el-icon-upload"
            size="mini"
            @click.stop="() => updateToLatest(data, data)"
          />

          <el-button
            v-if="![COMPONENT_IS_USED].includes(data.type)"
            type="text"
            icon="el-icon-s-tools"
            size="mini"
            @click.stop="() => setting(data, data)"
          />
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { cloneJson } from '../../utils/tool'
import { Tree, MessageBox, Message } from 'element-ui'
import { TYPE, TYPE_STRING } from '../../const'
import { projectIds } from '../../utils/keyId'
import listToTree from '../../utils/listToTree'
import localforage from 'localforage'

const initData = {
  1: {
    id: 1,
    type: TYPE.PROJECT,
    name: 'Playground'
  },
  2: {
    id: 2,
    parentId: 1,
    type: TYPE.COMPONENT,
    version: 1,
    name: 'Component'
  }
}

export default {
  name: 'TreeComponents',
  components: {
    ElTree: Tree
  },
  data() {
    return {
      data: {},
      filterText: '',
      ...TYPE
    }
  },
  computed: {
    listToTree() {
      return listToTree(cloneJson(Object.values(this.data)))
    },
    childrenOf() {
      return this.listToTree.childrenOf
    },
    tree() {
      const tree = this.listToTree.tree
      projectIds.appendIdNested(tree)
      return tree
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    data: {
      handler(value) {
        localforage.setItem('project', value)
      },
      deep: true
    }
  },
  created() {
    this.getProject()
  },
  methods: {
    ...mapActions('draft', ['setComponent']),
    async getProject() {
      let data = await localforage.getItem('project')

      if (!data) {
        data = initData
      }

      this.data = data
    },
    addNew(parent, type) {
      const typeString = TYPE_STRING[type]
      MessageBox.prompt(
        `Please name for the ${typeString}.Minimum is 6 character`,
        'CREATE' + typeString,
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          inputPattern: /\w{6,}/,
          inputErrorMessage: 'the name is incorrect'
        }
      ).then(({ value: name }) => {
        const newChild = {}
        if (type === TYPE.COMPONENT) {
          newChild.version = 1
        }

        newChild.type = type
        projectIds.appendIdNested(newChild)
        newChild.name = name
        newChild.parentId = parent.id
        this.$set(this.data, newChild.id, newChild)

        Message.success({
          type: 'success',
          message: 'Success to create ' + name
        })
      })
    },
    remove(data) {
      const name = data.name
      const typeString = TYPE_STRING[data.type]
      MessageBox.prompt(
        `Please enter the ${typeString} name to delete`,
        'DELETE',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          inputPattern: new RegExp(name),
          inputErrorMessage: 'the name is incorrect'
        }
      ).then(({ value }) => {
        this.$delete(this.data, data.id)
        Message.success({
          type: 'success',
          message: 'Success to delete ' + name
        })
      })
    },
    updateToLatest() {},
    setting() {},
    nodeDrop({ data: dragData }, { data: dropData }, action) {
      if (action === 'inner') {
        this.data[dragData.id].parentId = dropData.id
      }
    },
    nodeClick({ id, type }) {
      if ([TYPE.COMPONENT, TYPE.COMPONENT_IS_USED].includes(type)) {
        this.setComponent(id)
      }
    },
    allowDrop(a, b, c) {
      return c === 'inner' && [TYPE.FOLDER, TYPE.PROJECT].includes(b.data.type)
    },
    filterTagBySearching(value, data) {
      value = value.toLowerCase().toString()
      return data.name.toLowerCase().indexOf(value) !== -1
    }
  }
}
</script>

<style scoped lang="scss">
.custom-tree-node {
  font-size: 14px;
  padding-right: 8px;
}

.tree {
  background: transparent;
  height: calc(100% - 70px);
  overflow: scroll;
}

::v-deep.el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border-color: transparent;
  color: #c0c4cc;
}
</style>
