import { mapGetters, mapMutations } from 'vuex'
import { CHILDREN } from '../const'
import {
  childDelete,
  childUpdate,
  cloneJson,
  isUndefined,
  traversal
} from '../utils/tool'
import { draftIds } from '../utils/keyId'

export default {
  data() {
    const getterName = `${this.isExample ? 'example' : 'draft'}/childrenOf`
    // 這裡沒必要排序，index 在各自component選擇性處理就可以
    // appendNestedIds(innerChildren)
    // children 因為每次更新 nodesMap，如果innerChildren用computed會所有的component都被更新
    const children = this.$store.getters[getterName][this.id]
    return {
      innerChildren: children.map(({ id, tag }) => ({ id, tag }))
    }
  },
  computed: {
    ...mapGetters('example', ['examplesMapByTag']),
    firstChild() {
      return this.innerChildren[0]
    },
    hasAnyChild() {
      return this.firstChild
    }
  },
  watch: {
    innerChildren: {
      handler(newValue, oldValue) {
        console.log(JSON.stringify(newValue, oldValue))
      },
      deep: true
    }
  },
  created() {
    this.innerChildren.forEach(oldChild => {
      this.$watch(
        () => this.nodesMap[oldChild.id],
        (newChild, oldChild) => {
          console.log(oldChild.id)
          if (isUndefined(newChild)) {
            childDelete(this.innerChildren, oldChild)
          } else {
            childUpdate(oldChild, newChild)
          }
        },
        { deep: true }
      )
    })
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

      return nodes
    },

    create(example) {
      // 這裏拿到的example有可能有deep children
      // template has a `canNew` setup to check can new or not
      // layers, grid-generator, carousel, form-generator
      // can new layer-item, grid-item, carousel-item, form-item
      const { tag } = example
      const theTreeGonnaCreate =
        example || this.examplesMapByTag[tag][CHILDREN][0]

      const { id } = this.resetIdsAndRecord(theTreeGonnaCreate)

      this.innerChildren.push({ id, tag })
    },

    copy(theNodeIdGonnaCopy) {
      // copy should considerate to the grandChildren tree,
      // however each node should only include own children and update by `updateDifferenceToVuex`
      // the rest of grand children should new into vuex, they will take care it own self since they have commonMixin
      // const clonedInnerChildren = cloneJson()
      const theNodeGonnaCopy = this.innerChildren.find(
        x => x.id === theNodeIdGonnaCopy
      )

      const newNodesTree = {}

      function getChildrenTree(node, newNodesTree) {
        const children = this.childrenOf[node.id]
        node.children = children
        children.forEach(child => getChildrenTree(child, newNodesTree))
      }

      getChildrenTree(theNodeGonnaCopy, newNodesTree)
      const { id, tag } = this.resetIdsAndRecord(newNodesTree)

      this.innerChildren.push({ id, tag })
    },

    remove(theNodeIdGonnaRemove) {
      // remove only need to remove self and update by `updateDifferenceToVuex`
      // the grand children will destroy it self since their parentNode is gone
      // the rest need to do is updating grandChildren in vuex

      // the above finish the current tier
      // beneath is gonna delete grand children into vuex

      const theIndexGonnaRemove = this.innerChildren.findIndex(
        x => x.id === theNodeIdGonnaRemove
      )

      const records = [
        {
          path: theNodeIdGonnaRemove,
          value: undefined
        }
      ]

      function newGrandChildrenRecords(nodeId) {
        this.childrenOf[nodeId].forEach(child => {
          records.push({
            path: child.id,
            value: undefined
          })

          newGrandChildrenRecords(child.id)
        })
      }

      newGrandChildrenRecords(theNodeIdGonnaRemove)
      this.RECORD(records)
      this.innerChildren.splice(theIndexGonnaRemove, 1)

      // CLEAN_SELECTED_COMPONENT_IDS
      const allDeletedIds = [this.id, ...records.map(x => x.path)]
      this.CLEAN_SELECTED_COMPONENT_IDS(allDeletedIds)
    }
  }
}
