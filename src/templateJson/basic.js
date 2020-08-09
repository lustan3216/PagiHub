import {
  GRID_GENERATOR,
  GRID_ITEM,
  LAYERS,
  CAROUSEL,
  CAN_NEW_ITEM,
  TAG,
  CHILDREN,
  CAN_BE_EDITED,
  CAN_NOT_DELETE,
  CAN_NOT_COPY,
  STYLE,
  LABEL,
  AUTO_HEIGHT,
  CAN_NOT_RENAME,
  PROPS, SOFT_DELETE
} from '../const'

const points = ['lg', 'md', 'sm', 'xs', 'xxs']
const mapPoints = object =>
  points.reduce((all, point) => {
    all[point] = object
    return all
  }, {})

export const gridItems = function() {
  return [
    {
      [TAG]: GRID_ITEM,
      [PROPS]: mapPoints({ x: 0, y: 0, w: 22, h: 30 })
    },
    {
      [TAG]: GRID_ITEM,
      [PROPS]: mapPoints({ x: 22, y: 0, w: 20, h: 15 })
    }
  ]
}

export const gridGenerator = function(options) {
  return {
    w: 18,
    h: 300,
    [TAG]: GRID_GENERATOR,
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: gridItems(),
    ...options
  }
}

export const layers = function(options) {
  return {
    w: 18,
    h: 300,
    [TAG]: LAYERS,
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: [gridGenerator()],
    ...options
  }
}

export const carousel = function() {
  return {
    w: 36,
    h: 300,
    [TAG]: CAROUSEL,
    [CAN_NEW_ITEM]: true,
    [CAN_BE_EDITED]: true,
    [CHILDREN]: [
      gridGenerator({
        [LABEL]: 'indicators',
        [CAN_NOT_COPY]: true,
        [CAN_NOT_DELETE]: true,
        [SOFT_DELETE]: true,
        [CAN_NOT_RENAME]: true,
        [CAN_NEW_ITEM]: false,
        [CHILDREN]: [
          {
            [PROPS]: mapPoints({ x: 0, y: 0, w: 22, h: 71 }),
            [TAG]: GRID_ITEM,
            [LABEL]: 'prev',
            [CAN_NOT_COPY]: true,
            [CAN_NOT_RENAME]: true,
            [CAN_NOT_DELETE]: true
          },
          {
            [PROPS]: mapPoints({ x: 23, y: 0, w: 22, h: 71 }),
            [TAG]: GRID_ITEM,
            [LABEL]: 'next',
            [CAN_NOT_COPY]: true,
            [CAN_NOT_DELETE]: true,
            [CAN_NOT_RENAME]: true
          }
        ]
      }),
      gridGenerator({ [LABEL]: 'slider' }),
      gridGenerator({ [LABEL]: 'slider' }),
      gridGenerator({ [LABEL]: 'slider' })
    ]
  }
}

export const textEditor = function() {
  return {
    w: 18,
    h: 300,
    [TAG]: 'text-editor',
    [CAN_BE_EDITED]: true
  }
}

export const flexButton = function() {
  return {
    w: 9,
    h: 30,
    [TAG]: 'flex-button',
    [LABEL]: 'link',
    [CAN_BE_EDITED]: true
  }
}

export const flexImage = function() {
  return {
    w: 18,
    h: 300,
    [TAG]: 'flex-image'
  }
}

export const divider = function() {
  return {
    w: 18,
    h: 30,
    [TAG]: 'divider'
  }
}

export const videoPlayer = function() {
  return {
    w: 36,
    h: 300,
    [TAG]: 'video-player',
    [CAN_BE_EDITED]: true,
    [AUTO_HEIGHT]: true
  }
}

export const drawer = function() {
  const button = flexButton()
  button[LABEL] = 'drawer'
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
  textEditor(),
  flexImage(),
  carousel(),
  divider(),
  videoPlayer(),
  flexButton()
]
