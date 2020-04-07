<template>
  <div class="h-100">
    <controller-layer v-if="hasAnyChild" :id="firstChild.id">
      <component :is="firstChild.tag" :id="firstChild.id" />
    </controller-layer>

    <controller-layer v-else-if="isDraftMode && !isExample" :id="id">
      <div class="flex-center h-100 pointer">
        <example-add :id="id" @onAdd="resetIdsAndRecord($event)" />
        {{ node.id }}
        <el-button
          type="text"
          icon="el-icon-delete"
          size="small"
          @click.stop="() => remove(node.id)"
        />

        <el-tooltip
          v-if="copyComponentIds.length"
          effect="light"
          content="Paste Component"
          placement="bottom"
        >
          <el-button
            type="text"
            icon="el-icon-document-add"
            size="small"
            @click.stop="paste"
          />
        </el-tooltip>
      </div>
    </controller-layer>

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'v']"
      v-if="!isExample && isDraftMode && selected && copyComponentIds.length"
      :asd="$log(!isExample && isDraftMode && selected)"
      @shortkey="shortCutPaste"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import importTemplates from '../../../mixins/importTemplates'
import childrenMixin from '../../../mixins/children'
import nodeMixin from '../../../mixins/node'
import { findFirstCommonParentTree } from '../../../utils/node'
import { isMac } from '../../../utils/device'
import ControllerLayer from './ControllerLayer'
import ExampleAdd from './ExampleAdd'
import { TAG, GRID_ITEM } from '../../../const'
import { vmCopyNode } from '../../../utils/vmMap'

export default {
  name: 'GridItemChild',
  components: {
    ControllerLayer,
    ExampleAdd
  },
  mixins: [importTemplates, childrenMixin, nodeMixin],
  computed: {
    ...mapState('draft', ['nodesMap']),
    ...mapState('app', ['selectedComponentIds', 'copyComponentIds']),
    ...mapGetters('app', ['theOnlySelectedComponentId']),
    firstChild() {
      return this.innerChildren[0]
    },
    hasAnyChild() {
      return this.firstChild
    },
    selected() {
      return (
        this.selectedComponentIds.includes(this.id) ||
        this.selectedComponentIds.includes(
          this.firstChild && this.firstChild.id
        )
      )
    },
    onlyOneCopyComponentId() {
      return this.copyComponentIds.length === 1 && this.copyComponentIds[0]
    },
    onlyOneCopyComponentNode() {
      if (this.onlyOneCopyComponentId) {
        return this.nodesMap[this.onlyOneCopyComponentId]
      }
    }
  },
  methods: {
    isMac,
    paste() {
      if (
        this.onlyOneCopyComponentNode &&
        this.onlyOneCopyComponentNode[TAG] !== GRID_ITEM
      ) {
        this.resetIdsAndRecord(this.onlyOneCopyComponentNode)
      } else if (this.copyComponentIds.length > 1) {
        const tree = findFirstCommonParentTree(this.copyComponentIds)
        this.resetIdsAndRecord(tree)
      }
    },
    shortCutPaste() {
      // 要處理 grid item 不能複製grid item進去
      if (this.hasAnyChild) {
        if (this.onlyOneCopyComponentId === this.firstChild.id) {
          vmCopyNode(this.onlyOneCopyComponentNode)
        }
      } else {
        this.paste()
      }
    }
  }
}
</script>
