import {
  GRID_GENERATOR,
  POLYMORPHISM,
  GRID_GENERATOR_ITEM,
  LAYERS,
  CAROUSEL,
  CAN_NEW_ITEM,
  TAG,
  CHILDREN,
  CAN_BE_EDITED,
  CAN_NOT_DELETE,
  CAN_NOT_COPY,
  STYLES,
  LABEL,
  GRID,
  SOFT_DELETE,
  TEXT_EDITOR,
  SORT_INDEX,
  VALUE,
  HTML,
  COLUMNS,
  DEFAULT_BREAK_POINTS_MAP
} from '../const'

const mapPoints = object => {
  return Object.keys(DEFAULT_BREAK_POINTS_MAP).reduce((all, point) => {
    all[point] = object
    return all
  }, {})
}

export const gridGeneratorItem = function(options) {
  return {
    [TAG]: GRID_GENERATOR_ITEM,
    [LABEL]: 'container',
    [GRID]: mapPoints({ x: 0, y: 0, w: 22, h: 100 }),
    ...options
  }
}

export const gridGeneratorItems = function() {
  return [
    gridGeneratorItem(),
    gridGeneratorItem({
      [GRID]: mapPoints({ x: 22, y: 0, w: 44, h: 130 })
    })
  ]
}

export const gridGenerator = function(options) {
  return {
    [TAG]: GRID_GENERATOR,
    [CAN_NEW_ITEM]: true,
    [SORT_INDEX]: 0,
    [LABEL]: 'layout',
    [CHILDREN]: gridGeneratorItems(),
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
      gridGenerator({
        [POLYMORPHISM]: 'indicators',
        [CAN_NOT_COPY]: true,
        [CAN_NOT_DELETE]: true,
        [SOFT_DELETE]: true,
        [CAN_NEW_ITEM]: false,
        [CHILDREN]: [
          {
            [GRID]: mapPoints({ x: 0, y: 0, w: 22, h: 71 }),
            [TAG]: GRID_GENERATOR_ITEM,
            [POLYMORPHISM]: 'prev',
            [CAN_NOT_COPY]: true,
            [CAN_NOT_DELETE]: true
          },
          {
            [GRID]: mapPoints({ x: 23, y: 0, w: 22, h: 71 }),
            [TAG]: GRID_GENERATOR_ITEM,
            [POLYMORPHISM]: 'next',
            [CAN_NOT_COPY]: true,
            [CAN_NOT_DELETE]: true
          }
        ]
      }),
      gridGenerator({ [LABEL]: 'slider', [POLYMORPHISM]: 'slider' }),
      gridGenerator({ [LABEL]: 'slider', [POLYMORPHISM]: 'slider' }),
      gridGenerator({ [LABEL]: 'slider', [POLYMORPHISM]: 'slider' })
    ]
  }
}

export const textEditor = function(options) {
  return {
    [TAG]: TEXT_EDITOR,
    [CAN_BE_EDITED]: true,
    [STYLES]: {
      layout: { fitContainer: true }
    },
    ...options
  }
}

export const flexButton = function() {
  return {
    [TAG]: 'flex-button',
    [LABEL]: 'link',
    [STYLES]: {
      [HTML]: { border: '1px solid #dcdfe6' }
    },
    children: [
      gridGeneratorItem({
        [GRID]: mapPoints({ x: 0, y: 0, w: COLUMNS, h: 100 }),
        children: [
          textEditor({
            [VALUE]: 'I can be anything',
            [STYLES]: {
              layout: { fitContainer: true },
              [HTML]: { textAlign: 'center' }
            }
          })
        ]
      })
    ]
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
    [STYLES]: { ratioW: 16, ratioH: 9 }
  }
}

export const drawer = function() {
  const button = flexButton()
  button[LABEL] = 'drawer'
  button[CHILDREN] = [
    {
      [TAG]: 'drawer',
      [STYLES]: { background: '#fff' },
      [CHILDREN]: gridGeneratorItems()
    }
  ]

  return button
}

export default [
  gridGenerator(),
  textEditor(),
  flexImage(),
  carousel(),
  videoPlayer(),
  flexButton(),
  iframer()
]
