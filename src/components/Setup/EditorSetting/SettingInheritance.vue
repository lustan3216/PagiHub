<template>
  <div v-if="masterId">
    <el-divider content-position="left">
      INHERITANCE
    </el-divider>

    <div>
      <span class="title">
        {{ shortTagName(node) }}
      </span>

      <span class="small-title">
        {{ shortTagName(masterComponentSet) }} / {{ shortTagName(masterNode) }}
      </span>
    </div>

    <el-button-group class="w-100 flex m-t-10">
      <el-button
        type
        icon="el-icon-no-smoking"
        class="flex1"
        @click="detach"
      >
        Detach
      </el-button>

      <el-button
        type
        icon="el-icon-refresh-left"
        class="flex1"
        @click="reset"
      >
        Reset
      </el-button>

      <inheritance-jumper
        :id="id"
        :inherit-parent-id="inheritParentId"
        :master-component-set-id="masterComponentSetId"
        class="flex1"
        text
      />
    </el-button-group>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { getNode, traversalSelfAndChildren, shortTagName } from '@/utils/node'
import { getMasterId } from '@/utils/inheritance'
import InheritanceJumper from '@/components/TemplateUtils/InheritanceJumper'
import { GRID, PROPS, STYLES } from '@/const'

export default {
  name: 'Inheritance',
  components: {
    InheritanceJumper
  },
  props: {
    id: {
      type: String,
      required: true
    },
    inheritParentId: {
      type: String,
      default: ''
    },
    masterComponentSetId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('app', ['selectedComponentNode']),
    node() {
      return this.nodesMap[this.id]
    },
    masterId() {
      return getMasterId(this.node)
    },
    masterNode() {
      return getNode(this.masterId)
    },
    masterComponentSet() {
      return getNode(this.masterComponentSetId)
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    ...mapMutations('node', {
      NODE_SET: 'SET'
    }),
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    shortTagName,
    detach() {
      const records = []

      traversalSelfAndChildren(this.node, node => {
        records.push({
          path: `${node.id}.inheritance`,
          value: undefined
        })
      })

      this.RECORD(records)
    },
    reset() {
      const records = [
        {
          path: [this.node.id, STYLES],
          value: undefined
        },
        {
          path: [this.node.id, PROPS],
          value: undefined
        },
        {
          path: [this.node.id, GRID],
          value: undefined
        }
      ]

      this.RECORD(records)
    }
  }
}
</script>

<style scoped lang="scss">
.title {
  display: block;
  font-weight: bold;
  font-size: 16px;
  color: $color-black;
}
</style>
