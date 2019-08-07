import Vuex from 'vuex'
import Vue from 'vue'
import content from './module/content'
import templates from './module/templates'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  modules: {
    content,
    templates
  }
})

export default store
