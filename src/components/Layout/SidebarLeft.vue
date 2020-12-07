<template>
  <div
    :style="{ width: width + 'px' }"
    class="sidebar-left"
  >
    <split-pane
      :default-percent="25"
      split="horizontal"
    >
      <template slot="paneL">
        <panel-component-sets v-if="isLogin" />
      </template>

      <template slot="paneR">
        <menu-categories v-model="currentCategory" />
      </template>
    </split-pane>

    <transition name="fade">
      <menu-component-sets
        v-show="currentComponentSet"
        v-model="currentComponentSet"
        :category="currentCategory"
        :style="{ left: width + 'px' }"
        class="component-sets"
      />
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import interactjs from 'interactjs'
import SplitPane from 'vue-splitpane'
import PanelComponentSets from '@/components/Setup/PanelComponentSets'
import MenuCategories from '@/components/ComponentAdd/MenuCategories'
import MenuComponentSets from '@/components/ComponentAdd/MenuComponentSets'

export default {
  name: 'SidebarLeft',
  components: {
    PanelComponentSets,
    MenuCategories,
    MenuComponentSets,
    SplitPane
  },
  data() {
    return {
      activePanel: 'PanelComponentSets',
      width: 200,
      currentCategory: null,
      currentComponentSet: null,
      search: '',
      tags: [],
      defaultTags: []
    }
  },
  computed: {
    ...mapGetters('user', ['isLogin']),
    ...mapState('node', ['editingComponentSetId']),
    projectId() {
      return this.$route.params.projectId
    }
  },
  beforeMount() {
    this.$bus.$on('blockLibraryHide', this.blockLibraryHide)
  },
  beforeDestroy() {
    this.$bus.$off('blockLibraryHide', this.blockLibraryHide)
  },
  mounted() {
    interactjs(this.$el).resizable({
      edges: { left: false, right: true, bottom: false, top: false },
      ignoreFrom: '.component-sets',
      listeners: {
        move: event => {
          this.width = event.rect.width + event.deltaRect.left
        }
      },
      inertia: true
    })
  },
  methods: {
    blockLibraryHide() {
      this.currentComponentSet = null
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
  touch-action: none;
  background-color: white;
  border-right: 1px solid $color-grey;
  border-top: 1px solid $color-grey;
  height: 100%;
}

.component-sets {
  position: absolute;
  width: 300px;
  background-color: rgba(250, 250, 250, 1);
  z-index: 10;
  top: 0;
  height: calc(100vh - 47px);
  box-shadow: 15px 9px 20px 1px rgba(0,0,0,0.1);
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
