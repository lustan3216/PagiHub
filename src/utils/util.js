export function traversal(nodes, fn) {
  nodes.forEach(node => {
    fn(node)
    node.children && node.children.length && traversal(node.children, fn)
  })
}

export function findNestedLast(obj, key, value) {
  // Base case
  if (obj[key] === value) {
    return obj
  } else {
    const length = Object.keys(obj).length
    for (let i = length; i > -1; i--) {
      if (typeof obj[i] === 'object') {
        const found = this.findNestedLast(obj[i], key, value)
        if (found) {
          // If the object was found in the recursive call, bubble it up.
          return found
        }
      }
    }
  }
}
