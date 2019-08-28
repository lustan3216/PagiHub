import Vue from 'vue'
import templates from './templates'

let content
try {
  content = JSON.parse(localStorage.getItem('json'))
} catch (e) {
  content = []
}

const store = Vue.observable({
  templates,
  content,
  nodeForSetting: {},
  currentSidebar: null
})

export default store
