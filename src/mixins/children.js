import { mapGetters, mapMutations } from 'vuex'
import { CHILDREN } from '../const'
import { cloneJson, traversal } from '../utils/tool'
import { draftIds } from '../utils/keyId'

export default {
  data() {
    const getterName = `${this.isExample ? 'example' : 'draft'}/childrenOf`
    // 這裡沒必要排序，index 在各自component選擇性處理就可以
    // appendNestedIds(innerChildren)
    // children 因為每次更新 nodesMap，如果innerChildren用computed會所有的component都被更新
    return {
      innerChildren: cloneJson(this.$store.getters[getterName][this.id])
    }
  },
  computed: {
    ...mapGetters('example', ['examplesMapByTag']),
    firstChild() {
      return this.innerChildren[0]
    }
  },
  watch: {
    innerChildren(value) {
      // if children all empty, the node should be deleted
      // if (!value.length) {
      //   const { parentId } = this.currentNodesMap[this.id]
      //   const vm = vmMap[parentId]
      //   vm.remove(this.id)
      // }
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

      return nodes
    },

    create(example) {
      // 這裏拿到的example有可能有deep children
      // template has a `canNew` setup to check can new or not
      // layers, grid-generator, carousel, form-generator
      // can new layer-item, grid-item, carousel-item, form-item
      const { tag } = this.node
      let theTreeGonnaCreate =
        example || this.examplesMapByTag[tag][CHILDREN][0]

      theTreeGonnaCreate = this.resetIdsAndRecord(theTreeGonnaCreate)
      const { children: _, ...node } = theTreeGonnaCreate
      this.innerChildren.push(cloneJson(node))
    },

    copy(theNodeIdGonnaCopy) {
      // copy should considerate to the grandChildren tree,
      // however each node should only include own children and update by `updateDifferenceToVuex`
      // the rest of grand children should new into vuex, they will take care it own self since they have commonMixin
      // const clonedInnerChildren = cloneJson()
      const theNodeGonnaCopy = this.innerChildren.find(
        x => x.id === theNodeIdGonnaCopy
      )

      let tree = {}

      function getChildrenTree(node, tree) {
        const children = this.childrenOf[node.id]
        node.children = children
        children.forEach(child => getChildrenTree(child, tree))
      }

      getChildrenTree(theNodeGonnaCopy, tree)
      tree = this.resetIdsAndRecord(tree)
      this.innerChildren.push(cloneJson(theNodeGonnaCopy))
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
    },

    update(newChildren) {
      // 目前只有只有grid layout再用
      const records = []

      newChildren.forEach(child => {
        const attrs = ['x', 'y', 'w', 'h']
        attrs.forEach(attr => {
          records.push({
            path: `${child.id}.${attr}`,
            value: child[attr]
          })
        })
      })

      this.RECORD(records)
    }
  }
}
