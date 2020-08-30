<template>
  <el-button
    v-if="hasConnection"
    type
    @click="remove"
  >Remove Connection</el-button>
</template>

<script>
import { MASTER_ID } from '@/const'
import { traversalSelfAndChildren } from '@/utils/node'

export default {
  name: 'Connection',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    node() {
      return this.componentsMap[this.id]
    },
    hasConnection() {
      return this.node[MASTER_ID]
    }
  },
  methods: {
    remove() {
      const records = []
      traversalSelfAndChildren(this.node, node => {
        records.push({
          path: `${node.id}.masterId`
        })
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
