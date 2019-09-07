const idSet = new Set([0])

export function appendIds(node, key = 'id') {
  if (node[key]) {
    idSet.add(node[key])
  } else {
    node[key] = generateId()
  }

  if (node.children && node.children.length) {
    node.children.forEach(child => {
      appendIds(child)
    })
  }
}

export function removeIds(node, key = 'id') {
  node[key] = null

  if (node.children && node.children.length) {
    node.children.forEach(child => {
      removeIds(child)
    })
  }
}

export function resetIds(node, key = 'id') {
  node[key] = generateId()

  if (node.children && node.children.length) {
    node.children.forEach(child => {
      resetIds(child)
    })
  }
}

export function generateId() {
  const max = Math.max(...[...idSet])
  const id = max + 1
  idSet.add(id)
  return id
}
