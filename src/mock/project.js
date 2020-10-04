const Mock = require('better-mock')
const Random = Mock.Random

Mock.mock(/\/projects/, 'get', () => {
  return {
    'data': [{
      'createdAt': 1601167686555,
      'description': '<p>22222222</p>',
      'id': '01EK6GFYWVTM04JCF76N2KGPFB',
      'label': 'dwqdwq',
      'tag': 'project',
      'userId': 'Facebook_3189364354449003',
      'version': 0,
      'tags': ['form'],
      'updatedAt': 1601167686555
    }]
  }
})
