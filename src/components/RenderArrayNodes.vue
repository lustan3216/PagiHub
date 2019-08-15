<script>
import Vue from 'vue'
import importTemplatesMixin from '../mixins/importTemplates.js'

export default {
  name: 'RenderNode',
  mixins: [importTemplatesMixin],
  props: {
    array: {
      type: Array,
      required: true
    }
  },
  parseNode(h, child) {
    if (typeof child === 'string') {
      return Vue.prototype._v(child)
    }
    const { tag, data, children = [] } = child
    
    if (!data) this.$set(child, 'data', {})
    if (!data.props) this.$set(child.data, 'props', {})
    if (!data.props.observableNode) data.props.observableNode = child
    // debugger
    return h(tag, data, children.map(child => this.parseNode(h, child)))
  },
  render(h) {
    return parseNode(h, toTree(this.array))
  }
}
</script>
