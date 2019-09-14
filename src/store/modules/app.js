const state = {
  mode: 'website'
}

const mutations = {
  SET(state, data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (state[key] !== undefined) {
        state[key] = data[key]
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
