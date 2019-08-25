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
        tag: 'grid-generator',
        children: [
          {
            _data: { props: { x: 0, y: 0, w: 2, h: 2 }}
          },
          {
            _data: { props: { x: 2, y: 0, w: 2, h: 4 }}
          },
          {
            _data: { props: { x: 4, y: 0, w: 2, h: 5 }}
          },
          {
            _data: { props: { x: 6, y: 0, w: 2, h: 3 }}
          },
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
      // {
      //   tag: 'carousel'
      // }
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
