const gridItems = [
  { tag: 'grid-item', x: 0, y: 0, w: 22, h: 71, moved: false },
  { tag: 'grid-item', x: 38, y: 19, w: 34, h: 52, moved: false },
  { tag: 'grid-item', x: 22, y: 19, w: 16, h: 52, moved: false },
  { tag: 'grid-item', x: 22, y: 0, w: 50, h: 19, moved: false }
]

export const gridGenerator = function(children = gridItems) {
  return {
    tag: 'grid-generator',
    children
  }
}

export const carousel = function() {
  return {
    tag: 'carousel',
    children: [gridGenerator(), gridGenerator(), gridGenerator()]
  }
}

export const card = function() {
  return {
    tag: 'card',
    children: [gridGenerator()]
  }
}

export const editor = function() {
  return {
    tag: 'editor'
  }
}

export const flexButton = function() {
  return {
    tag: 'flex-button'
  }
}

export const flexImage = function() {
  return {
    tag: 'flex-image'
  }
}

export const divider = function() {
  return {
    tag: 'divider'
  }
}

export const videoPlayer = function() {
  return {
    tag: 'video-player'
  }
}

export const formGenerator = function() {
  return {
    tag: 'form-generator',
    children: [
      {
        tag: 'grid-item',
        x: 0,
        y: 0,
        w: 22,
        h: 15,
        children: [
          {
            tag: 'form-item',
            type: 'input',
            field: 'test',
            title: 'test',
            value: ''
          }
        ]
      },
      {
        tag: 'grid-item',
        x: 0,
        y: 15,
        w: 22,
        h: 15,
        children: [
          {
            tag: 'form-item',
            type: 'radio',
            title: '是否包邮',
            field: '是否包邮',
            value: '0',
            options: [
              { value: '0', label: '不包邮', disabled: false },
              { value: '1', label: '包邮', disabled: true }
            ]
          }
        ]
      },
      {
        tag: 'grid-item',
        x: 22,
        y: 0,
        w: 22,
        h: 15,
        children: [
          {
            tag: 'form-item',
            type: 'input',
            title: '商品名称',
            field: '商品名称',
            value: 'iphone 7',
            props: {
              type: 'text'
            },
            validate: [
              { required: true, message: '请输入goods_name', trigger: 'blur' }
            ]
          }
        ]
      }
    ]
  }
}

export const drawer = function() {
  return {
    tag: 'drawer',
    children: [
      gridGenerator([
        { tag: 'grid-item', x: 0, y: 0, w: 72, h: 10, moved: false }
      ])
    ]
  }
}

export default {
  name: 'Basic',
  icon: 'el-icon-message',
  components: [
    flexButton(),
    flexImage(),
    gridGenerator(),
    carousel(),
    divider(),
    videoPlayer(),
    editor(),
    card(),
    drawer()
  ]
}
