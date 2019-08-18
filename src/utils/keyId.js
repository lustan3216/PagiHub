let keyId = 1

export function removeDeepKey(node) {
  if (node.data && node.data.key) node.data.key = null
  if (node.children && node.children.length >= 1) {
    node.children.forEach(node => removeDeepKey(node))
  }
}

export function appendKey(node) {
  if (!node.data.key) {
    node.data.key = ++keyId
  }
}
