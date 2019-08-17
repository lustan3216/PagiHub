export default [
  {
    type: 'button',
    icon: 'el-icon-message',
    components: [
      {
        tag: 'carousel'
      },
      {
        tag: 'el-radio',
        children: ['备选项']
      }
    ]
  },
  {
    type: 'article',
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
