export function toPrecision(number, precision) {
  const pow = Math.pow(10, precision)
  return Math.floor(number * pow) / pow
}
