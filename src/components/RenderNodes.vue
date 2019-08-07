<script>
import Vue from 'vue'

function parseNodeChildren(h, children = []) {
  return children.map(child => parseNode(h, child))
}

function parseNode(h, child) {
  if (typeof child === 'string') {
    return Vue.prototype._v(child)
  }
  const { tag, data, children } = child

  return h(tag, { ...data }, parseNodeChildren(h, children))
}

export default {
  name: 'RenderNodes',
  functional: true,
  props: {
    dom: {
      type: Array,
      required: true
    }
  },
  render(h, context) {
    return parseNodeChildren(h, context.props.dom)
  }
}
</script>
