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

export const lazyImage = function() {
  return {
    tag: 'lazy-image'
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
    tag: 'form-generator'
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

export default [
  {
    name: 'Basic',
    icon: 'el-icon-message',
    components: [
      flexButton(),
      lazyImage(),
      gridGenerator(),
      formGenerator(),
      carousel(),
      divider(),
      videoPlayer(),
      editor(),
      card(),
      drawer()
    ]
  }
]
