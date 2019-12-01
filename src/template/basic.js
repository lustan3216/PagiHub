function gridItems() {
  return [
    { tag: 'grid-item', x: 0, y: 0, w: 22, h: 71 },
    { tag: 'grid-item', x: 38, y: 19, w: 34, h: 52 },
    { tag: 'grid-item', x: 22, y: 19, w: 16, h: 52 },
    { tag: 'grid-item', x: 22, y: 0, w: 50, h: 19 }
  ]
}

export const gridGenerator = function(children) {
  return {
    tag: 'grid-generator',
    children: children || gridItems()
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
    children: gridItems()
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

export const layer = function() {
  return {
    tag: 'layer'
  }
}

export const drawer = function() {
  return {
    tag: 'drawer',
    children: [{ tag: 'grid-item', x: 0, y: 0, w: 72, h: 10 }]
  }
}

export default function() {
  return {
    name: 'Basic',
    icon: 'el-icon-message',
    components: [
      layer(),
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
}
