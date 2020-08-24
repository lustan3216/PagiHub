<template>
  <div
    :style="{ width: editingAsset ? '400px' : '260px' }"
    class="sidebar-left"
  >
    <el-button-group class="flex">
      <el-tooltip
        effect="light"
        placement="top"
        content="Pages"
      >
        <el-button
          icon="el-icon-brush"
          class="flex1"
          @click="activePanel = 'PanelPages'"
        />
      </el-tooltip>

      <el-tooltip
        effect="light"
        placement="top"
        content="Components"
      >
        <el-button
          icon="el-icon-brush"
          class="flex1"
          @click="activePanel = 'PanelProject'"
        />
      </el-tooltip>

      <el-tooltip
        effect="light"
        placement="top"
        content="Asset"
      >
        <el-button
          icon="el-icon-film"
          class="flex1"
          @click="activePanel = 'PanelAsset'"
        />
      </el-tooltip>
    </el-button-group>

    <panel-asset
      v-show="editingAsset"
      v-if="editingAsset || uploading"
      @processStart="uploading = true"
      @processEnd="uploading = false"
    />

    <split-pane
      v-if="!editingAsset"
      :default-percent="40"
      split="horizontal"
    >
      <template slot="paneL">
        <component
          v-if="isLogin"
          :is="activePanel"
        />
      </template>

      <template slot="paneR">
        <panel-nodes />
      </template>
    </split-pane>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SplitPane from 'vue-splitpane'
import DialogComponentSet from '../Setup/DialogComponentSet'

export default {
  name: 'SidebarLeft',
  components: {
    PanelNodes: () => import('../Setup/PanelNodes'),
    PanelProject: () => import('../Setup/PanelProject'),
    PanelPages: () => import('../Setup/PanelPages'),
    PanelAsset: () => import('../Setup/PanelAsset'),
    DialogComponentSet,
    SplitPane
  },
  data() {
    return {
      activePanel: 'PanelProject',
      uploading: false
    }
  },
  created() {
    this.$bus.$on('open-panel-asset', () => {
      this.activePanel = 'PanelAsset'
    })
  },
  computed: {
    ...mapGetters('user', ['isLogin']),
    editingAsset() {
      return this.activePanel === 'PanelAsset'
    },
    projectId() {
      return this.$route.params.projectId
    }
  },
  watch: {
    editingAsset() {
      this.artBoardResizing(false)
    }
  },
  methods: {
    ...mapActions('app', ['artBoardResizing'])
  }
}
</script>

<style scoped lang="scss">
.el-button-group {
  margin-right: -1px;
  & > button {
    border-color: $color-grey;
  }
}

.sidebar-left {
  background-color: white;
  border-right: 1px solid $color-grey;
  transition: width 0.2s ease;
}

::v-deep {
  .splitter-pane {
    background-color: #ffffff;
    padding: 5px;
    box-sizing: border-box;
  }
  .splitter-paneR {
    z-index: 1;
  }
  .splitter-pane-resizer {
    z-index: 2;
  }
}
</style>
