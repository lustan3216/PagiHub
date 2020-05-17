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
      @node-click="checkedChange"
      @node-drop="nodeParentChange"
    >
      <span
        slot-scope="{ data }"
        :class="{ selected: selectedComponentSetIds.includes(data.id) }"
        class="justify-between align-center w-100 node"
        @click="() => nodeClick(data)"
      >
        <span class="el-tree-node__label m-r-10">
          <i
            v-if="NODE_TYPE.PROJECT === data.type"
            class="el-icon-files"
          />
          <i
            v-if="NODE_TYPE.FOLDER === data.type"
            class="el-icon-folder-opened"
          />
          <i
            v-if="NODE_TYPE.COMPONENT_SET === data.type"
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
            :is="`dialog-${kebabCase(NODE_TYPE_STRING[data.type])}`"
            class="m-l-5"
          />
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { NODE_TYPE, NODE_TYPE_STRING } from '@/const'
import DialogProject from './DialogProject'
import DialogFolder from './DialogFolder'
import DialogComponentSet from './DialogComponentSet'
import DialogDelete from './DialogDelete'
import { kebabCase } from '@/utils/string'
import { off, on } from 'element-ui/src/utils/dom'
import { isMac } from '@/utils/device'

export default {
  name: 'PanelProject',
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
      NODE_TYPE,
      NODE_TYPE_STRING,
      ...NODE_TYPE,
      pressCtrl: false
    }
  },
  computed: {
    ...mapGetters('project', ['tree']),
    ...mapState('app', ['selectedComponentSetIds'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    tree(a,b) {
      // console.log(JSON.stringify(a), JSON.stringify(b))
    }
  },
  mounted() {
    on(window, 'keydown', this.keydwon)
    on(window, 'keyup', this.keyup)
  },
  beforeDestroy() {
    off(window, 'keydown', this.keydwon)
    off(window, 'keyup', this.keyup)
  },
  methods: {
    kebabCase,
    ...mapActions('project', ['modifyProjectNodeParent']),
    ...mapActions('component', ['setComponentSet']),
    ...mapMutations('app', [
      'TOGGLE_SELECTED_COMPONENT_SET_IN_IDS',
      'TOGGLE_SELECTED_COMPONENT_SET_ID'
    ]),
    keydwon(e) {
      if (isMac()) {
        if (e.metaKey) {
          this.pressCtrl = true
        }
      } else {
        if (e.ctrlKey) {
          this.pressCtrl = true
        }
      }
    },
    keyup(e) {
      if (isMac()) {
        if (e.metaKey) {
          this.pressCtrl = false
        }
      } else {
        if (e.ctrlKey) {
          this.pressCtrl = false
        }
      }
    },
    nodeParentChange({ data: childData }, { data: parentData }, action) {
      if (action === 'inner') {
        this.modifyProjectNodeParent({
          parentId: parentData.id,
          id: childData.id
        })
      }
    },
    nodeClick(node) {
      if (NODE_TYPE.COMPONENT_SET === node.type) {
        this.setComponentSet(node.id)
      }
    },
    allowDrop(_, { data: dropData }, action) {
      return (
        action === 'inner' &&
        [NODE_TYPE.FOLDER, NODE_TYPE.PROJECT].includes(dropData.type)
      )
    },
    filterTagBySearching(value, data) {
      value = value.toLowerCase().toString()
      return data.name.toLowerCase().indexOf(value) !== -1
    },
    checkedChange({ id, type }) {
      if (NODE_TYPE.COMPONENT_SET !== type) return

      if (this.pressCtrl) {
        this.TOGGLE_SELECTED_COMPONENT_SET_IN_IDS(id)
      } else {
        this.selectedComponentSetIds.forEach(id => {
          this.$refs.tree.setChecked(id, false)
        })
        this.TOGGLE_SELECTED_COMPONENT_SET_ID(id)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.selected {
  background: aliceblue;
  border-radius: 3px;
}

.node {
  padding-left: 5px;
}

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
