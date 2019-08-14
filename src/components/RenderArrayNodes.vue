<script>
import Vue from 'vue'
import toTree from 'list-to-tree-lite'
import importTemplatesMixin from '../mixins/importTemplates.js'

function parseNode(h, child) {
  if (typeof child === 'string') {
    return Vue.prototype._v(child)
  }
  const { tag, children = [] } = child

  child.data = child.data || {}
  child.data.props = child.data.props || {}
  child.data.props.observableNode = child

  return h(tag, { ...child.data }, children.map(child => parseNode(h, child)))
}

export default {
  name: 'RenderNode',
  mixins: [importTemplatesMixin],
  props: {
    array: {
      type: Array,
      required: true
    }
  },
  render(h) {
    return parseNode(h, toTree(this.array))
  }
}
</script>
