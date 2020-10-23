import {
  GRID_GENERATOR,
  POLYMORPHISM,
  GRID_GENERATOR_ITEM,
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
  VALUE,
  HTML
} from '../const'

const mapPoints = (object, breakpoint) => {
  return {
    [breakpoint]: object
  }
}

export const gridGeneratorItem = function(options, breakpoint) {
  return {
    [TAG]: GRID_GENERATOR_ITEM,
    [LABEL]: 'container',
    [GRID]: mapPoints({ x: 0, y: 0, w: 22, h: 100 }, breakpoint),
    [STYLES]: { layout: { stack: true }},
    ...options
  }
}

export const gridGeneratorItems = function(options, breakpoint) {
  return [
    {
      [TAG]: GRID_GENERATOR_ITEM,
      [LABEL]: 'container',
      [GRID]: mapPoints({ x: 0, y: 0, w: 22, h: 100 }, breakpoint),
      [STYLES]: { layout: { stack: true }},
      ...options
    },
    {
      [TAG]: GRID_GENERATOR_ITEM,
      [LABEL]: 'container',
      [GRID]: mapPoints({ x: 22, y: 0, w: 22, h: 100 }, breakpoint),
      [STYLES]: { layout: { stack: true }},
      ...options
    }
  ]
}

export const gridGenerator = function(options, breakpoint) {
  return {
    [TAG]: GRID_GENERATOR,
    [CAN_NEW_ITEM]: true,
    [LABEL]: 'container',
    [CHILDREN]: gridGeneratorItems(null, breakpoint),
    ...options
  }
}

export const background = function(options, breakpoint) {
  return {
    [TAG]: GRID_GENERATOR,
    [CAN_NEW_ITEM]: true,
    [POLYMORPHISM]: 'background',
    [CHILDREN]: gridGeneratorItems(null, breakpoint),
    ...options
  }
}

export const iframer = function(options) {
  return {
    [TAG]: 'iframer',
    [CAN_BE_EDITED]: true,
    [LABEL]: 'iframe',
    ...options
  }
}

export const carousel = function(options, breakpoint) {
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
            [GRID]: mapPoints({ x: 0, y: 0, w: 22, h: 71 }, breakpoint),
            [TAG]: GRID_GENERATOR_ITEM,
            [POLYMORPHISM]: 'prev',
            [CAN_NOT_COPY]: true,
            [CAN_NOT_DELETE]: true
          },
          {
            [GRID]: mapPoints({ x: 23, y: 0, w: 22, h: 71 }, breakpoint),
            [TAG]: GRID_GENERATOR_ITEM,
            [POLYMORPHISM]: 'next',
            [CAN_NOT_COPY]: true,
            [CAN_NOT_DELETE]: true
          }
        ]
      }),
      gridGenerator(
        { [LABEL]: 'slider', [POLYMORPHISM]: 'slider' },
        breakpoint
      ),
      gridGenerator(
        { [LABEL]: 'slider', [POLYMORPHISM]: 'slider' },
        breakpoint
      ),
      gridGenerator({ [LABEL]: 'slider', [POLYMORPHISM]: 'slider' }, breakpoint)
    ]
  }
}

export const textEditor = function(options) {
  return {
    [TAG]: TEXT_EDITOR,
    [CAN_BE_EDITED]: true,
    [VALUE]: 'text',
    [LABEL]: 'text',
    ...options
  }
}

export const flexButton = function(options) {
  return {
    [TAG]: 'flex-button',
    [LABEL]: 'button',
    [STYLES]: {
      [HTML]: { border: '1px solid #dcdfe6' }
    },
    children: [
      textEditor({
        [VALUE]: 'I can be changed to anything',
        [STYLES]: {
          [HTML]: { textAlign: 'center' }
        }
      })
    ]
  }
}

export const flexImage = function(options) {
  return {
    [TAG]: 'flex-image',
    [LABEL]: 'image',
    ...options
  }
}

export const videoPlayer = function(options) {
  return {
    [TAG]: 'video-player',
    [CAN_BE_EDITED]: true,
    [STYLES]: { ratioW: 16, ratioH: 9 }
  }
}

export const exampleMap = {
  [GRID_GENERATOR]: gridGenerator,
  [GRID_GENERATOR_ITEM]: gridGeneratorItem,
  [CAROUSEL]: carousel,
  [TEXT_EDITOR]: textEditor,
  iframer,
  'flex-button': flexButton,
  'flex-image': flexImage,
  'video-player': videoPlayer
}
export const descriptionMap = {
  [GRID_GENERATOR]:
    'Each container can only include an element to control element size',
  [GRID_GENERATOR_ITEM]: 'not yet',
  [CAROUSEL]:
    'Carousel could nested with multi carousels to have more creation',
  [TEXT_EDITOR]: 'Support 900+ Google font',
  iframer: 'For embedding service you like, such as your website or youtube',
  'flex-button': 'A functioning block you can redirect page',
  'flex-image': 'Just image = = ',
  'video-player': 'Support Youtube and Viemo'
}

export function getExample(tag, options = {}, breakpoint) {
  return exampleMap[tag](options, breakpoint)
}
