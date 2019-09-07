import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import nodes from './modules/nodes'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    nodes,
    app
  }
})
