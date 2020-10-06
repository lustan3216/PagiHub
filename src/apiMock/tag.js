const Mock = require('better-mock')

Mock.mock(/\/tags\?.+$/, 'get', (data) => {
  return [
    'form', 'button'
  ]
})
