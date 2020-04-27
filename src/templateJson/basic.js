import {
  GRID_GENERATOR,
  GRID_ITEM,
  CAN_NEW_ITEM,
  TAG,
  CHILDREN,
  CAN_EDIT,
  CAN_DRAG,
  CAN_NOT_DELETE,
  CAN_NOT_COPY,
  STYLE,
  NAME,
  AUTO_HEIGHT,
  SOFT_DELETE,
  PROPS
} from '../const'

const gridItems = function() {
  return [
    {
      [TAG]: GRID_ITEM,
      [PROPS]: {
        lg: { x: 0, y: 0, w: 22, h: 30 }
      }
    }
  ]
}

export const gridGenerator = function(options) {
  return {
    [TAG]: GRID_GENERATOR,
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: gridItems(),
    ...options
  }
}

export const layers = function() {
  return {
    [TAG]: 'layers',
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: [gridGenerator()]
  }
}

export const layersInteract = function(options) {
  return {
    [TAG]: 'layers-interact',
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: [gridGenerator()],
    ...options
  }
}

export const carousel = function() {
  const _gridGenerator = gridGenerator({
    [CAN_NOT_COPY]: true,
    [CAN_NOT_DELETE]: true,
    [CHILDREN]: [
      {
        [PROPS]: { lg: { x: 0, y: 0, w: 22, h: 71 }},
        [TAG]: GRID_ITEM,
        [NAME]: 'prev',
        [CAN_NOT_COPY]: true,
        [CAN_NOT_DELETE]: true
      },
      {
        [PROPS]: { lg: { x: 23, y: 0, w: 22, h: 71 }},
        [TAG]: GRID_ITEM,
        [NAME]: 'next',
        [CAN_NOT_COPY]: true,
        [CAN_NOT_DELETE]: true
      }
    ]
  })
  return {
    [TAG]: 'carousel',
    [CAN_NEW_ITEM]: false,
    [CAN_DRAG]: true,
    [CHILDREN]: [
      layersInteract({
        [NAME]: 'indicators',
        [SOFT_DELETE]: true,
        [CAN_NOT_COPY]: true,
        [CAN_NOT_DELETE]: true,
        [CAN_NEW_ITEM]: false,
        [CHILDREN]: [_gridGenerator]
      }),
      gridGenerator({ name: 'slider' }),
      gridGenerator({ name: 'slider' }),
      gridGenerator({ name: 'slider' })
    ]
  }
}

export const card = function() {
  return {
    [TAG]: 'card',
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: gridItems()
  }
}

export const editorText = function() {
  return {
    [TAG]: 'editor-text',
    [CAN_EDIT]: true
  }
}

export const flexButton = function() {
  return {
    [TAG]: 'flex-button',
    [CAN_EDIT]: true
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
    [CAN_DRAG]: true,
    [AUTO_HEIGHT]: true
  }
}

export const drawer = function() {
  const button = flexButton()
  button[NAME] = 'drawer'
  button[CHILDREN] = [
    {
      [TAG]: 'drawer',
      [STYLE]: { background: '#fff' },
      [CHILDREN]: gridItems()
    }
  ]

  return button
}

export default [
  layers(),
  layersInteract(),
  card(),
  flexButton(),
  flexImage(),
  gridGenerator(),
  carousel(),
  divider(),
  videoPlayer(),
  editorText(),
  drawer()
]