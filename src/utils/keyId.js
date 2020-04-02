export const ROOT_ID = 0
const idSet = new Set([ROOT_ID])

export function appendNestedIds(nodes) {
  nodes = Array.toArray(nodes)
  nodes.forEach(node => appendNestedId(node))
}

function appendNestedId(node, key = 'id') {
  if (node[key]) {
    idSet.add(node[key])
  } else {
    node[key] = generateId()
  }
  appendNestedIds(node.children)
}

export function removeNestedIds(nodes) {
  nodes = Array.toArray(nodes)
  nodes.forEach(node => removeNestedId(node))
}

function removeNestedId(node, key = 'id') {
  node[key] = undefined
  removeNestedIds(node.children)
}

export function resetNestedIds(node, key = 'id') {
  delete node.i
  node[key] = generateId()

  if (node.children && node.children.length) {
    node.children.forEach(child => {
      resetNestedIds(child)
    })
  }
}

export function generateId() {
  const max = Math.max(...[...idSet])
  const id = max + 1
  idSet.add(id)
  return id
}
