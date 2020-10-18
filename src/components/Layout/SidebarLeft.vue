<template>
  <div
    :style="{ width: width + 'px' }"
    class="sidebar-left"
  >
    <!--    <el-button-group class="flex">-->
    <!--      <el-button-->
    <!--        class="flex1 small-title"-->
    <!--        @click="activePanel = 'PanelComponentSets'"-->
    <!--      >-->
    <!--        Layers-->
    <!--      </el-button>-->

    <!--      <el-button-->
    <!--        class="flex1"-->
    <!--        @click="activePanel = 'PanelAsset'"-->
    <!--      >-->
    <!--        Asset-->
    <!--      </el-button>-->
    <!--    </el-button-group>-->

    <!--    <panel-asset v-if="editingAsset" />-->

    <split-pane
      :default-percent="40"
      split="horizontal"
    >
      <template slot="paneL">
        <panel-component-sets v-if="isLogin" />
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
import interactjs from 'interactjs'

export default {
  name: 'SidebarLeft',
  components: {
    PanelComponents,
    PanelComponentSets,
    SplitPane
  },
  data() {
    return {
      activePanel: 'PanelComponentSets',
      width: 260
    }
  },
  created() {
    this.$bus.$on('open-panel-asset', () => {
      this.activePanel = 'PanelAsset'
    })
  },
  mounted() {
    interactjs(this.$el).resizable({
      edges: { left: false, right: true, bottom: false, top: false },
      listeners: {
        move: event => {
          this.width = event.rect.width + event.deltaRect.left
        }
      },
      inertia: true
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
  height: 100%;
  overflow: hidden;
}

::v-deep {
  .vue-splitter-container {
    height: 100%;
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
