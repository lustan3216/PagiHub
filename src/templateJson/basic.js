import {
  GRID,
  KEY,
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
  PROPS,
  SOFT_DELETE,
  TEXT_EDITOR,
  SORT_INDEX
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
      [PROPS]: mapPoints({ x: 0, y: 0, w: 22, h: '100px' })
    },
    {
      [TAG]: GRID_ITEM,
      [PROPS]: mapPoints({ x: 22, y: 0, w: 44, h: '130px' })
    }
  ]
}

export const grid = function(options) {
  return {
    [TAG]: GRID,
    [CAN_NEW_ITEM]: true,
    [SORT_INDEX]: 0,
    [CHILDREN]: gridItems(),
    ...options
  }
}

export const layers = function(options) {
  return {
    [TAG]: LAYERS,
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: [grid()],
    [LABEL]: 'magic-layout',
    ...options
  }
}

export const componentBody = function(options) {
  return {
    [TAG]: 'component-body',
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: [grid()],
    [LABEL]: 'component-body',
    ...options
  }
}

export const componentCover = function(options) {
  return {
    [TAG]: 'component-cover',
    [CAN_NEW_ITEM]: true,
    ...options
  }
}

export const iframer = function(options) {
  return {
    [TAG]: 'iframer',
    [CAN_BE_EDITED]: true,
    ...options
  }
}

export const carousel = function() {
  return {
    [TAG]: CAROUSEL,
    [CAN_NEW_ITEM]: true,
    [CAN_BE_EDITED]: true,
    [CHILDREN]: [
      grid({
        [KEY]: 'indicators',
        [CAN_NOT_COPY]: true,
        [CAN_NOT_DELETE]: true,
        [SOFT_DELETE]: true,
        [CAN_NEW_ITEM]: false,
        [CHILDREN]: [
          {
            [PROPS]: mapPoints({ x: 0, y: 0, w: 22, h: '71px' }),
            [TAG]: GRID_ITEM,
            [KEY]: 'prev',
            [CAN_NOT_COPY]: true,
            [CAN_NOT_DELETE]: true
          },
          {
            [PROPS]: mapPoints({ x: 23, y: 0, w: 22, h: '71px' }),
            [TAG]: GRID_ITEM,
            [KEY]: 'next',
            [CAN_NOT_COPY]: true,
            [CAN_NOT_DELETE]: true
          }
        ]
      }),
      layers({ [LABEL]: 'slider', [KEY]: 'slider' }),
      layers({ [LABEL]: 'slider', [KEY]: 'slider' }),
      layers({ [LABEL]: 'slider', [KEY]: 'slider' })
    ]
  }
}

export const textEditor = function() {
  return {
    [TAG]: TEXT_EDITOR,
    [CAN_BE_EDITED]: true
    // [AUTO_HEIGHT]: true
  }
}

export const flexButton = function() {
  return {
    [TAG]: 'flex-button',
    [LABEL]: 'link',
    [STYLE]: {
      default: { border: '1px solid #dcdfe6' }
    },
    [CAN_BE_EDITED]: true
  }
}

export const flexImage = function(props) {
  return {
    [TAG]: 'flex-image',
    ...props
  }
}

export const videoPlayer = function() {
  return {
    [TAG]: 'video-player',
    [CAN_BE_EDITED]: true,
    props: { ratio: { w: 16, h: 9 }}
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
  videoPlayer(),
  flexButton(),
  iframer()
]
