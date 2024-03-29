import { directive as freeStyleDirective } from '../freeStyle'

const directive = {
  update: method('update'),
  bind: method('bind'),
  unbind: function(element, binding, vnode) {
    const { id } = vnode.context
    freeStyleDirective.unbind(element, { value: id }, vnode)
    // ObserveVisibility.unbind(element, binding, vnode)
  }
}

function method(name) {
  return function(element, binding, vnode) {
    const { id } = vnode.context

    if (!binding.value) {
      return
    }

    // const {
    //   innerStyles: { show: showStyle, ...styles }
    // } = vnode.context

    const { innerStyles } = vnode.context

    freeStyleDirective[name](
      element,
      {
        value: { id, ...innerStyles }
      },
      vnode
    )

    // if (objectHasAnyValue(showStyle)) {
    //   ObserveVisibility[name](
    //     element,
    //     {
    //       ...binding,
    //       value(visible) {
    //         if (visible) {
    //           const mergedStyle = Object.assign.all([
    //             {},
    //             styles,
    //             { default: showStyle, id }
    //           ])
    //           freeStyle(element, { value: mergedStyle }, vnode)
    //         } else {
    //           freeStyle(element, { value: { id, ...styles }}, vnode)
    //         }
    //       }
    //     },
    //     vnode
    //   )
    // } else {
    //   ObserveVisibility[name](element, { value: false }, vnode)
    // }
  }
}

export default directive
