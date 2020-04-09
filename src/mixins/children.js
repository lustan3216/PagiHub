import { mapGetters, mapMutations } from 'vuex'
import { CHILDREN } from '../const'
import { cloneJson, traversal } from '../utils/tool'
import { componentIds } from '../utils/keyId'

export default {
  computed: {
    ...mapGetters('draft', ['childrenOf']),
    ...mapGetters('example', ['examplesMapByTag']),
    innerChildren() {
      const getterName = `${this.isExample ? 'example' : 'draft'}/childrenOf`
      // 這裡沒必要排序，index 在各自component選擇性處理就可以
      // appendNestedIds(innerChildren)
      // children 因為每次更新 nodesMap，如果innerChildren用computed會所有的component都被更新
      return this.$store.getters[getterName][this.id].map(
        ({ [CHILDREN]: _, moved, parentId, ...node }) => ({
          ...node
        })
      )
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),

    _addNodesToParentAndRecord(nodes) {
      const records = []

      nodes = cloneJson(nodes)
      componentIds.resetNestedIds(nodes)
      nodes.parentId = this.id

      traversal(nodes, (_node, _parentNode) => {
        // eslint-disable-next-line
        const { [CHILDREN]: _, ...node } = _node
        records.push({
          path: node.id,
          value: { ...node, parentId: node.parentId }
        })
      })

      this.RECORD(records)
    },

    _createEmptyItem() {
      // should use vmMap method to call to keep consistency

      // 這裏拿到的example有可能有deep children
      // template has a `canNew` setup to check can new or not
      // layers, grid-generator, carousel, form-generator
      // can new layer-item, grid-item, carousel-item, form-item
      const { tag } = this.node
      // eslint-disable-next-line
      const emptyItem = this.examplesMapByTag[tag][CHILDREN][0]

      this._addNodesToParentAndRecord(emptyItem)
    },

    _copy(theNodeIdGonnaCopy) {
      // should use vmMap method to call to keep consistency
      const theNodeGonnaCopy = this.innerChildren.find(
        x => x.id === theNodeIdGonnaCopy
      )

      const children = this.childrenOf[theNodeIdGonnaCopy]
      theNodeGonnaCopy[CHILDREN] = children
      this._addNodesToParentAndRecord(theNodeGonnaCopy)
    },

    _remove(theNodeIdGonnaRemove) {
      // should use vmMap method to call to keep consistency
      const records = [
        {
          path: theNodeIdGonnaRemove,
          value: undefined
        }
      ]

      const grandChildrenRecords = nodeId => {
        this.childrenOf[nodeId].forEach(child => {
          records.push({
            path: child.id,
            value: undefined
          })

          grandChildrenRecords(child.id)
        })
      }

      grandChildrenRecords(theNodeIdGonnaRemove)
      this.RECORD(records)

      // CLEAN_SELECTED_COMPONENT_IDS
      const allDeletedIds = [this.id, ...records.map(x => x.path)]
      this.CLEAN_SELECTED_COMPONENT_IDS(allDeletedIds)
    }
  }
}
