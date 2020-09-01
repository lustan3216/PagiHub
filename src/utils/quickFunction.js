import store from '@/store'

let timer
export function updateWrapperStyle() {
  if (!store.getters['mode/isDraftMode']) {
    return
  }

  store.commit('app/SET', { gridResizing: true })
  if (timer !== null) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    store.dispatch('app/artBoardResizing', false)
  }, 80)
}
