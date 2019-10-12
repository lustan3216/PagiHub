Array.toArray = function(e) {
  if (Array.isArray(e)) {
    return e
  } else if (e === undefined) {
    return []
  } else {
    return [e]
  }
}

Array.last = function(e) {
  return e[e.length - 1]
}

Array.first = function(e) {
  return e[0]
}
