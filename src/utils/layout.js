import { BREAK_POINTS } from '@/const'

export function getBreakpoint(element) {
  const { clientWidth } = element

  const points = Object.keys(BREAK_POINTS)
  return points.find(key => clientWidth >= BREAK_POINTS[key]) || 'xxs'
}
