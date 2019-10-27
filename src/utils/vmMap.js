const vmMap = {}

export function appendVm(vm) {
  vmMap[vm.id] = vm
}

export function getVm(id) {
  return vmMap[id]
}
