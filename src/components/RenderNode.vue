<script>
import { appendKey } from '../utils/keyId'
import Vue from 'vue'

function parseNode(h, node, parent) {
  if (typeof node === 'string') {
    return Vue.prototype._v(node)
  }

  const { tag } = node

  if (!node.children) {
    Vue.set(node, 'children', [])
  }
  
  if (!node.data) node.data = {}
  if (!node.data.props) node.data.props = {}
  node.data.props.$observableVNode = node
  node.data.props.$parentVNode = parent
  
  if (!node._data) Vue.set(node, '_data', { props: {}})
  if (!node._data.props) Vue.set(node._data, 'props', {})

  appendKey(node)

  return h(tag, { ...node.data }, node.children.map(child => parseNode(h, child, node)))
}

export default {
  name: 'RenderNode',
  functional: true,
  props: {
    dom: {
      type: Object,
      required: true
    }
  },
  render(h, content) {
    return parseNode(h, content.props.dom)
  }
}
</script>
