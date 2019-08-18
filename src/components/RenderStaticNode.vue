<script>
import Vue from 'vue'

function parseNode(h, child) {
  if (typeof child === 'string') {
    return Vue.prototype._v(child)
  }

  const { tag, data = {}, children = [] } = child

  return h(tag, data, children.map(child => parseNode(h, child)))
}

export default {
  name: 'RenderStaticNode',
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
