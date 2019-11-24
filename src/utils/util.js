export function traversal(nodes, fn) {
  nodes.forEach(node => {
    fn(node)
    node.children && node.children.length && this.traversal(node.children, fn)
  })
}
