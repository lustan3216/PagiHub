export const vmMap = {}

window.vmMap = vmMap

export function appendVm(vm) {
  vmMap[vm.id] = vm
}

export function removeVm(vm) {
  delete vmMap[vm.id]
}

export function getComputedStyle(id) {
  return window.getComputedStyle(vmMap[id].$el)
}

export function assignStyles(id, styles) {
  vmMap[id].assignStyles(styles)
}
