import { traversalSelfAndChildren } from "@/utils/node"
const Mock = require('better-mock')
// Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
// Mock.XHR.prototype.send = function() {
//   debugger
//   if (this.custom.xhr) {
//     this.custom.xhr.withCredentials = this.withCredentials || false
//   }
//   this.proxy_send(...arguments)
// }

Mock.mock(/\/component-sets$/, 'post', (data) => {
  const componentSet = JSON.parse(data.body)
  componentSet.tag = 'component-set'

  componentSet.id = 'testComponentSetId'
  componentSet.children[0].parentId = componentSet.id

  const children = []
  traversalSelfAndChildren(componentSet.children, (node) => {
    children.push(node)
  })

  componentSet.children = children
  return componentSet
})

Mock.mock(/\/component-sets\/.+\/children$/, 'get', (data) => [])
Mock.mock(/\/component-sets\/.+\/children$/, 'patch', (data) => [])

