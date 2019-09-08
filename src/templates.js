export default [
  {
    type: 'Basic',
    icon: 'el-icon-message',
    components: [
      {
        tag: 'editor'
      },
      {
        tag: 'flex-button'
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
        tag: 'grid-generator',
        children: [
          { x: 0, y: 0, w: 2, h: 3 },
          { x: 2, y: 0, w: 2, h: 4 },
          { x: 4, y: 0, w: 2, h: 5 },
          { x: 6, y: 0, w: 2, h: 3 }
        ]
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
        tag: 'carousel',
        children: [{ tag: 'div' }, { tag: 'div' }, { tag: 'div' }]
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
