const state = {
  vNodes: [
    {
      id: new Date(),
      tag: 'div',
      sort: 4,
      children: ['4']
    },
    {
      id: new Date(),
      tag: 'div',
      sort: 3,
      data: {
        class: [{ 'wii-second': true }, 'blue-color'],
        style: {
          color: 'green'
        },
        attrs: {
          id: 'second',
          title: '测试'
        },
        props: {
          myProp: 'bar'
        }
      },
      children: ['33']
    }
  ]
}

const mutations = {
  SET_CONTENT(state, data) {
    state.vNodes = data
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
