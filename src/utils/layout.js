import { BREAK_POINTS } from '@/const'

export function getBreakpoint(width) {
  const { clientWidth } = width

  const points = Object.keys(BREAK_POINTS)
  return points.find(key => clientWidth >= BREAK_POINTS[key]) || 'xxs'
}
