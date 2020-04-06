import { CAN_NEW_ITEM, STYLES, TAG, CHILDREN } from '../const'

const gridItems = function() {
  return [
    { [TAG]: 'grid-item', x: 0, y: 0, w: 22, h: 71 },
    { [TAG]: 'grid-item', x: 38, y: 19, w: 34, h: 52 },
    { [TAG]: 'grid-item', x: 22, y: 19, w: 16, h: 52 },
    { [TAG]: 'grid-item', x: 22, y: 0, w: 50, h: 19 }
  ]
}

export const gridGenerator = function() {
  return {
    [TAG]: 'grid-generator',
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: gridItems()
  }
}

export const layers = function() {
  return {
    [TAG]: 'layers',
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: [gridGenerator()]
  }
}

export const initTemplate = function() {
  const _layers = layers()
  _layers[STYLES] = { background: '#fff' }
  return _layers
}

export const carousel = function() {
  return {
    [TAG]: 'carousel',
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: [gridGenerator(), gridGenerator(), gridGenerator()]
  }
}

export const card = function() {
  return {
    [TAG]: 'card',
    [CHILDREN]: gridItems()
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

export const drawer = function() {
  return {
    [TAG]: 'drawer',
    [CHILDREN]: gridItems()
  }
}

export default [
  layers(),
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
