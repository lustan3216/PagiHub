import { BREAK_POINTS } from '@/const'
import { arrayDescSort } from '@/utils/array'

export function getBreakpoint(width) {
  const { clientWidth } = width

  const points = Object.keys(BREAK_POINTS)
  return points.find(key => clientWidth >= BREAK_POINTS[key]) || 'xxs'
}

export function normalizeBreakpoint(breakpoints) {
  breakpoints = breakpoints.filter(x => x || x === 0).map(x => parseInt(x))
  return arrayDescSort(breakpoints)
}
