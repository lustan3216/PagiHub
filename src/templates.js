export const gridGenerator = function() {
  return {
    tag: 'grid-generator',
    children: [
      { tag: 'grid-item', x: 0, y: 0, w: 12, h: 4 },
      { tag: 'grid-item', x: 12, y: 0, w: 12, h: 4 },
      { tag: 'grid-item', x: 24, y: 0, w: 12, h: 2 },
      { tag: 'grid-item', x: 24, y: 2, w: 12, h: 2 }
    ]
  }
}

export const carousel = function() {
  return {
    tag: 'carousel',
    children: [gridGenerator(), gridGenerator(), gridGenerator()]
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

export const playerYoutube = function() {
  return {
    tag: 'player-youtube'
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
      carousel(),
      divider(),
      playerYoutube(),
      editor()
    ]
  },
  {
    name: 'Button',
    icon: 'el-icon-message',
    components: []
  },
  {
    name: 'Layout',
    icon: 'el-icon-message',
    components: []
  },
  {
    name: 'Card',
    icon: 'el-icon-message',
    components: []
  }
]
