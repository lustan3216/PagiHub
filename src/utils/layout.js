import store from '@/store'
import { BREAK_POINTS_MAP } from '@/const'
import { vmGet } from '@/utils/vmMap'
import { toPrecision } from '@/utils/number'
import { isUndefined } from '@/utils/tool'

export function horizontalUnitFromTo(fromId, toId, distance, fromUnit, toUnit) {
  if (isUndefined(toUnit)) {
    toUnit = fromUnit
  }
  const fromPx = horizontalUnitConvert(fromId, distance, fromUnit, 'px')
  return horizontalUnitConvert(toId, fromPx, 'px', toUnit)
}

export function verticalUnitFromTo(fromId, toId, distance, fromUnit, toUnit) {
  if (isUndefined(toUnit)) {
    toUnit = fromUnit
  }
  const fromPx = verticalUnitConvert(fromId, distance, fromUnit, 'px')
  return verticalUnitConvert(toId, fromPx, 'px', toUnit)
}

export function horizontalUnitConvert(id, distance, inputUnit, outputUnit) {
  const vm = vmGet(id)
  return unitConvert(id, distance, inputUnit, outputUnit, vm.percentUnitW())
}

export function verticalUnitConvert(id, distance, inputUnit, outputUnit) {
  const vm = vmGet(id)
  return unitConvert(id, distance, inputUnit, outputUnit, vm.percentUnitH())
}

function unitConvert(id, distance, inputUnit, outputUnit, percentUnit) {
  let distanceInPx
  switch (inputUnit) {
    case '%':
      distanceInPx = distance * percentUnit
      break
    case 'vw':
      distanceInPx = distance * store.getters['layout/vw']
      break
    case 'vh':
      distanceInPx = distance * store.getters['layout/vh']
      break
    default:
      // 'px'
      distanceInPx = distance
      break
  }
  switch (outputUnit) {
    case '%':
      distanceInPx = distanceInPx / percentUnit
      return toPrecision(distanceInPx, 1)
    case 'vw':
      distanceInPx = distanceInPx / store.getters['layout/vw']
      return toPrecision(distanceInPx, 1)
    case 'vh':
      distanceInPx = distanceInPx / store.getters['layout/vh']
      return toPrecision(distanceInPx, 1)
    default:
      // 'px'
      return toPrecision(distanceInPx, 0)
  }
}

export function sortDescBreakpoint(breakpoints) {
  const points = Object.keys(BREAK_POINTS_MAP)
  const array = []

  points.forEach(point => {
    if (breakpoints.includes(point)) {
      array.push(point)
    }
  })

  return array
}

export function sortAscBreakpoint(breakpoints) {
  return sortDescBreakpoint(breakpoints).reverse()
}

export function findBreakpoint(breakpointsMap, width) {
  let breakpoints = Object.keys(breakpointsMap)
  breakpoints = sortDescBreakpoint(breakpoints)

  return (
    breakpoints.find((key, index) => {
      const prevKey = breakpoints[index - 1]
      if (width < breakpointsMap[prevKey] && width >= breakpointsMap[key]) {
        return key
      }
    }) || breakpoints[0]
  )
}
