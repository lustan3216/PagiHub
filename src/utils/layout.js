import store from '@/store'
import { BREAK_POINTS_MAP } from '@/const'
import { vmGet } from '@/utils/vmMap'
import { toPrecision } from '@/utils/number'

export function unitConvert(id, distance, inputUnit, outputUnit) {
  const vm = vmGet(id)

  let distanceInPx
  switch (inputUnit) {
    case 'px':
      distanceInPx = distance
      break
    case '%':
      distanceInPx = distance * vm.percentUnitW
      break
    case 'vw':
      distanceInPx = distance * store.getters['layout/vw']
      break
    case 'vh':
      distanceInPx = distance * store.getters['layout/vh']
      break
  }
  switch (outputUnit) {
    case 'px':
      return toPrecision(distanceInPx, 0)
    case '%':
      distanceInPx = distanceInPx / vm.percentUnitW
      return toPrecision(distanceInPx, 1)
    case 'vw':
      distanceInPx = distanceInPx / store.getters['layout/vw']
      return toPrecision(distanceInPx, 1)
    case 'vh':
      distanceInPx = distanceInPx / store.getters['layout/vh']
      return toPrecision(distanceInPx, 1)
  }
}
export function distanceRefine(id, distance, inputUnit, outputUnit) {
  return unitConvert(id, distance, inputUnit, outputUnit)
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
