const state = {
  vNodes: [
    {
      type: 'button',
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
    },
    {
      type: 'profile',
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
    },
    {
      type: 'photo',
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
}

export default {
  namespaced: true,
  state
}
