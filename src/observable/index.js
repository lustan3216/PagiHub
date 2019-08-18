import Vue from 'vue'
import templates from './templates'

const store = Vue.observable({
  templates,
  content: [],
  nodeForSetting: {},
  currentSidebar: null
})

export default store
