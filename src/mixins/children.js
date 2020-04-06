import { mapGetters, mapMutations } from 'vuex'
import { CHILDREN } from '../const'
import { cloneJson, traversal } from '../utils/tool'
import { draftIds } from '../utils/keyId'

export default {
  computed: {
    ...mapGetters('draft', ['childrenOf']),
    ...mapGetters('example', ['examplesMapByTag']),
    firstChild() {
      return this.innerChildren[0]
    },
    hasAnyChild() {
      return this.firstChild
    },
    innerChildren() {
      const getterName = `${this.isExample ? 'example' : 'draft'}/childrenOf`
      // 這裡沒必要排序，index 在各自component選擇性處理就可以
      // appendNestedIds(innerChildren)
      // children 因為每次更新 nodesMap，如果innerChildren用computed會所有的component都被更新
      return this.$store.getters[getterName][this.id].map(
        ({ children, moved, parentId, ...node }) => ({
          ...node
        })
      )
    }
  },
  methods: {
    ...mapMutations('draft', ['RECORD']),

    resetIdsAndRecord(nodes) {
      const records = []

      nodes = cloneJson(nodes)
      draftIds.resetNestedIds(nodes)
      nodes.parentId = this.id

      traversal(nodes, (_node, _parentNode) => {
        const { children: _, ...node } = _node
        records.push({
          path: node.id,
          value: { ...node, parentId: node.parentId }
        })
      })

      this.RECORD(records)
    },

    create() {
      // 這裏拿到的example有可能有deep children
      // template has a `canNew` setup to check can new or not
      // layers, grid-generator, carousel, form-generator
      // can new layer-item, grid-item, carousel-item, form-item
      const { tag } = this.node
      const theTreeGonnaCreate = this.examplesMapByTag[tag][CHILDREN][0]

      this.resetIdsAndRecord(theTreeGonnaCreate)
    },

    copy(theNodeIdGonnaCopy) {
      const theNodeGonnaCopy = this.innerChildren.find(
        x => x.id === theNodeIdGonnaCopy
      )

      const children = this.childrenOf[theNodeIdGonnaCopy]
      theNodeGonnaCopy[CHILDREN] = children
      this.resetIdsAndRecord(theNodeGonnaCopy)
    },

    remove(theNodeIdGonnaRemove) {
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
