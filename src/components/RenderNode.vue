<script>
import { appendKey } from '../utils/keyId'
import Vue from 'vue'

function parseNode(h, node) {
  if (typeof node === 'string') {
    return Vue.prototype._v(node)
  }

  const { tag, children = [] } = node

  if (!node.data) node.data = {}
  if (!node.data.props) node.data.props = {}
  node.data.props.$observableNode = node

  if (!node._data) Vue.set(node, '_data', { props: {}})
  if (!node._data.props) Vue.set(node._data, 'props', {})

  appendKey(node)

  return h(tag, { ...node.data }, children.map(child => parseNode(h, child)))
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
  methods: {},
  render(h, content) {
    return parseNode(h, content.props.dom)
  }
}
</script>
