<script>
import Vue from 'vue'
import importTemplatesMixin from '../mixins/importTemplates.js'
function parseNode(h, child) {
  if (typeof child === 'string') {
    return Vue.prototype._v(child)
  }

  const { tag, children = [] } = child

  if (!child.data) child.data = {}
  if (!child.data.props) child.data.props = {}
  child.data.props.observableNode = child

  if (!child._data) Vue.set(child, '_data', { props: {}})
  if (!child._data.props) Vue.set(child._data, 'props', {})

  return h(tag, { ...child.data }, children.map(child => parseNode(h, child)))
}

export default {
  name: 'RenderNode',
  functional: true,
  mixins: [importTemplatesMixin],
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
