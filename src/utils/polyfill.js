Array.toArray = function(e) {
  if (Array.isArray(e)) {
    return e
  } else if (e === undefined) {
    return []
  } else {
    return [e]
  }
}
