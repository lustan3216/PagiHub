const idSet = new Set([0])

export function appendId(node, key = 'i') {
  if (node[key]) {
    idSet.add(node[key])
  } else {
    node[key] = generateId()
  }
}

export function generateId() {
  const max = Math.max(...[...idSet])
  const id = max + 1
  idSet.add(id)
  return id
}
