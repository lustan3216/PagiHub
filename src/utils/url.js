export function queryString(obj, prefix) {
  const str = []
  let p
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + '[]' : p
      const v = obj[p]
      str.push(
        v !== null && typeof v === 'object'
          ? queryString(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      )
    }
  }
  return str.join('&')
}
