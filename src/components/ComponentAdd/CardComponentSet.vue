<template>
  <div
    v-if="componentSet"
    class="example-card"
  >
    <tip-copy class="m-b-10" />

    <div class="p-10 justify-between">
      <b style="line-height: 28px; font-size: 24px;">
        {{ componentSet.label }}
      </b>

      <div class="flex">
        <portal-target name="asd" class="copy-button">
          <el-button disabled>
            Copy Design
          </el-button>
        </portal-target>

        <el-button @click="replaceCurrentPage">
          Replace Current Page
        </el-button>

        <dialog-component-set
          :copy-component-set="componentSet"
          text="Add To New Page"
          type
          @created="closeTab"
        />
      </div>
    </div>

    <div class="relative z-index1 p-1">
      <example-view-port :id="id">
        <art-board :id="id" />
      </example-view-port>
    </div>

    <div v-if="componentSet.tags && componentSet.tags.length">
      <div class="p-15">
        <p class="title p-t-5 bold">Tags</p>

        <el-tag
          v-for="tag in componentSet.tags"
          :key="tag"
          effect="plain"
          class="m-r-5"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <div
      v-if="componentSet.description"
      class="p-15"
    >
      <b class="title">Description</b>

      <p v-html="componentSet.description" />
    </div>
  </div>
</template>

<script>
import { shortTagName } from '@/utils/node'
import ComponentGiver from '../TemplateUtils/ComponentGiver'
import TipCopy from '../Tip/TipCopy'
import { Tag } from 'element-ui'
import { mapGetters } from 'vuex'
import ExampleViewPort from './ExampleViewPort'
import ArtBoard from '@/components/Layout/ArtBoard'
import DialogComponentSet from '@/components/Setup/DialogComponentSet'
import { vmRemoveNode, vmAddNodeToParent } from '@/utils/vmMap'

export default {
  name: 'CardComponentSet',
  components: {
    ArtBoard,
    TipCopy,
    ComponentGiver,
    ElTag: Tag,
    DialogComponentSet,
    ExampleViewPort
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters('node', ['backgroundNode']),
    componentSet() {
      return this.nodesMap[this.id]
    }
  },
  methods: {
    shortTagName,
    closeTab() {
      this.$bus.$emit('dialog-component-visible', false)
    },
    replaceCurrentPage() {
      const background = this.componentSet.children[0]
      background.children.forEach(node =>
        vmAddNodeToParent(this.backgroundNode.id, node)
      )
      this.backgroundNode.children.forEach(node => vmRemoveNode(node))
      this.closeTab()
    }
  }
}
</script>

<style scoped lang="scss">
.example-card {
  border-radius: 5px;
  height: 100%;
  padding: 0 10px 10px;
}
.example {
  overflow: scroll;
  border: 1px solid $color-grey;
  padding: 5px;
}
  ::v-deep.copy-button{
    .el-button {
      height: 32px;
      margin-right: 10px;
    }
  }
</style>
