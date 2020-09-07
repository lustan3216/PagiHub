<script>
import { getNode } from '@/utils/node'
import { mapActions } from 'vuex'
import { getValueByPath } from '@/utils/tool'

export const inheritanceObject = () => {
  return {
    inheritParentId: null,
    masterComponentSetId: null,
    loaded: false
  }
}

export default {
  name: 'InheritanceController',
  provide() {
    return {
      inheritance: this.inheritance
    }
  },
  inject: {
    isExample: { default: false }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      inheritance: inheritanceObject()
    }
  },
  computed: {
    node() {
      return getNode(this.id)
    },
    masterParentNode() {
      return this.componentsMap[this.masterComponentSetId]
    },
    masterComponentSetId() {
      return getValueByPath(this.node, 'inheritance.masterComponentSetId')
    }
  },
  watch: {
    masterParentNode: {
      handler(value) {
        if (value) {
          this.inheritance.loaded = true
        }
      },
      immediate: true
    }
  },
  async created() {
    Object.assign(this.inheritance, {
      inheritParentId: this.id,
      masterComponentSetId: this.masterComponentSetId
    })

    if (this.masterComponentSetId) {
      // 這裏需要同步，讓下面的 instance node 拿資料比較好判斷，像是nodeMixin裡面的computed的children
      // 不然因為request非同步，會不知道一開始是沒有後面有，還是本來就沒有
      await this.getComponentSetChildren(this.masterComponentSetId)
    }
  },
  methods: {
    ...mapActions('node', ['getComponentSetChildren'])
  },
  render() {
    return this.$slots.default[0]
  }
}
</script>
