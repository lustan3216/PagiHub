<template>
  <div
    :style="{ width: editingAsset ? '400px' : '260px' }"
    class="sidebar-left"
  >
    <el-button-group class="flex">
      <el-button
        class="flex1 small-title"
        @click="activePanel = 'PanelComponentSets'"
      >
        Layers
      </el-button>

      <el-button
        class="flex1"
        @click="activePanel = 'PanelAsset'"
      >
        Asset
      </el-button>
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
        <keep-alive>
          <panel-components
            v-if="componentSetLoaded"
            :key="editingComponentSetId"
          />
        </keep-alive>
      </template>
    </split-pane>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SplitPane from 'vue-splitpane'
import { getValueByPath } from '@/utils/tool'
import PanelComponents from '@/components/Setup/PanelComponents'
import PanelComponentSets from '@/components/Setup/PanelComponentSets'
import PanelAsset from '@/components/Setup/PanelAsset'

export default {
  name: 'SidebarLeft',
  components: {
    PanelComponents,
    PanelComponentSets,
    PanelAsset,
    SplitPane
  },
  data() {
    return {
      activePanel: 'PanelComponentSets',
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
    ...mapState('node', ['editingComponentSetId']),
    componentSetLoaded() {
      return getValueByPath(this.nodesMap, [
        this.editingComponentSetId,
        'children',
        0
      ])
    },
    editingAsset() {
      return this.activePanel === 'PanelAsset'
    },
    projectId() {
      return this.$route.params.projectId
    }
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
  height: 100%;
}

::v-deep {
  .vue-splitter-container {
    @include calc-vh('height', '100% - 20px');
  }
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
