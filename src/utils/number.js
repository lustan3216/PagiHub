export function toPrecision(num, precision) {
  return parseFloat(
    Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
  )
}
