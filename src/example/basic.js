import {
  GRID_ITEM,
  CAN_NEW_ITEM,
  TAG,
  CHILDREN,
  CAN_EDIT_TEXT,
  CAN_DRAG,
  STYLE
} from '../const'

const gridItems = function() {
  return [{ [TAG]: GRID_ITEM, x: 0, y: 0, w: 22, h: 71 }]
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

export const rootLayers = function() {
  return {
    [TAG]: 'rootLayers',
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: [gridGenerator()]
  }
}

export const carousel = function() {
  return {
    [TAG]: 'carousel',
    [CAN_NEW_ITEM]: true,
    [CAN_DRAG]: true,
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
    [TAG]: 'editor-text',
    [CAN_EDIT_TEXT]: true
  }
}

export const flexButton = function() {
  return {
    [TAG]: 'flex-button',
    [CAN_EDIT_TEXT]: true
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
    [TAG]: 'video-player',
    [CAN_DRAG]: true
  }
}

export const drawer = function() {
  const button = flexButton()

  button[CHILDREN] = [{
    [TAG]: 'drawer',
    [STYLE]: { background: '#fff' },
    [CHILDREN]: gridItems()
  }]

  return button
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
