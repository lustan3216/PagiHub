import { BREAK_POINTS_MAP } from '@/const'

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
