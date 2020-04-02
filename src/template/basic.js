import { STYLES, TAG, CHILDREN } from '../const'

export const gridGenerator = function(children) {
  const gridItems = [
    { [TAG]: 'grid-item', x: 0, y: 0, w: 22, h: 71 },
    { [TAG]: 'grid-item', x: 38, y: 19, w: 34, h: 52 },
    { [TAG]: 'grid-item', x: 22, y: 19, w: 16, h: 52 },
    { [TAG]: 'grid-item', x: 22, y: 0, w: 50, h: 19 }
  ]

  return {
    [TAG]: 'grid-generator',
    [CHILDREN]: children || gridItems
  }
}

export const initTemplate = function() {
  return {
    [TAG]: 'layers',
    [STYLES]: { background: '#fff' },
    [CHILDREN]: [gridGenerator()]
  }
}

export const carousel = function() {
  return {
    [TAG]: 'carousel',
    [CHILDREN]: [gridGenerator(), gridGenerator(), gridGenerator()]
  }
}

export const card = function() {
  return {
    [TAG]: 'card',
    [CHILDREN]: [gridGenerator()]
  }
}

export const editorText = function() {
  return {
    [TAG]: 'editor-text'
  }
}

export const flexButton = function() {
  return {
    [TAG]: 'flex-button'
  }
}

export const flexImage = function() {
  return {
    [TAG]: 'flex-image'
  }
}

export const divider = function() {
  return {
    [TAG]: 'divider'
  }
}

export const videoPlayer = function() {
  return {
    [TAG]: 'video-player'
  }
}

export const layer = function() {
  return {
    [TAG]: 'layer'
  }
}

export const drawer = function() {
  return {
    [TAG]: 'drawer',
    [CHILDREN]: [
      gridGenerator([{ [TAG]: 'grid-item', x: 0, y: 0, w: 72, h: 10 }])
    ]
  }
}

export default [
  layer(),
  flexButton(),
  flexImage(),
  gridGenerator(),
  carousel(),
  divider(),
  videoPlayer(),
  editorText(),
  card(),
  drawer()
]
