<script>
import { mapActions } from 'vuex'
import { getMasterComponentSetIdFromInheritMap } from '@/utils/inheritMapUploader'

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
      return this.nodesMap[this.id]
    },
    masterComponentSetId() {
      return getMasterComponentSetIdFromInheritMap(this.node)
    },
    masterParentNode() {
      return this.nodesMap[this.masterComponentSetId]
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
  created() {
    Object.assign(this.inheritance, {
      inheritParentId: this.id,
      masterComponentSetId: this.masterComponentSetId
    })

    if (this.masterComponentSetId) {
      this.getComponentSetChildren(this.masterComponentSetId)
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
