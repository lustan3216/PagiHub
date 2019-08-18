export default [
  {
    type: 'Basic',
    icon: 'el-icon-message',
    components: [
      {
        tag: 'editor'
      }
    ]
  },
  {
    type: 'Image',
    icon: 'el-icon-message',
    components: [
      {
        tag: 'lazy-image'
      }
    ]
  },
  {
    type: 'Spacer',
    icon: 'el-icon-message',
    components: [
      {
        tag: 'spacer'
      }
    ]
  },
  {
    type: 'Article',
    icon: 'el-icon-message',
    components: []
  },
  {
    type: 'Fancy Component',
    icon: 'el-icon-message',
    components: [
      {
        tag: 'carousel'
      }
    ]
  },
  {
    type: 'Form',
    icon: 'el-icon-message',
    components: [
      {
        tag: 'el-checkbox',
        children: ['备选项']
      },
      {
        tag: 'el-radio',
        children: ['备选项']
      }
    ]
  }
]
