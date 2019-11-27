export const vmMap = {}
window.vmMap = vmMap
export function appendVm(vm) {
  vmMap[vm.id] = vm
}

export function removeVm(vm) {
  delete vmMap[vm.id]
}
