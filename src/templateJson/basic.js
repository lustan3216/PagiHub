import {
  GRID_GENERATOR,
  GRID_GENERATOR_ITEM,
  CAROUSEL,
  CAN_NEW_ITEM,
  TAG,
  CHILDREN,
  CAN_BE_EDITED,
  STYLES,
  LABEL,
  TEXT_EDITOR,
  VALUE,
  CAN_NOT_DELETE
} from '../const'

export const gridGeneratorItem = function(options, grid) {
  return {
    [TAG]: GRID_GENERATOR_ITEM,
    [LABEL]: 'container',
    grid,
    ...options
  }
}

export const rectangle = function(options, grid) {
  return {
    [TAG]: 'rectangle',
    grid,
    [STYLES]: {
      html: {
        border: '1px solid #b5b9c1',
        background: '#E8E8E9'
      }
    },
    ...options
  }
}

// export const gridGeneratorItems = function(options, grid) {
//   return [
//     {
//       [TAG]: GRID_GENERATOR_ITEM,
//       [LABEL]: 'container',
//       [GRID]: mapPoints(
//         { x: 0, y: 0, w: 22, h: 100, unitW: '%', unitH: 'px' },
//         grid
//       ),
//       [STYLES]: { layout: { stack: true }},
//       ...options
//     },
//     {
//       [TAG]: GRID_GENERATOR_ITEM,
//       [LABEL]: 'container',
//       [GRID]: mapPoints(
//         { x: 22, y: 0, w: 22, h: 100, unitW: '%', unitH: 'px' },
//         grid
//       ),
//       [STYLES]: { layout: { stack: true }},
//       ...options
//     }
//   ]
// }

export const gridGenerator = function(options, grid) {
  return {
    [TAG]: GRID_GENERATOR,
    [LABEL]: 'container',
    grid,
    ...options
  }
}

export const slider = function(options, grid) {
  return {
    [TAG]: 'slider',
    [CAN_NEW_ITEM]: true,
    grid,
    ...options
  }
}

export const group = function(options, grid) {
  return {
    [TAG]: 'group',
    [CAN_NEW_ITEM]: true,
    [CAN_BE_EDITED]: true,
    grid,
    ...options
  }
}

export const background = function(options) {
  return {
    [TAG]: 'background',
    [CAN_NEW_ITEM]: true,
    [CAN_NOT_DELETE]: true,
    ...options
  }
}

export const iframer = function(options, grid) {
  return {
    [TAG]: 'iframer',
    [LABEL]: 'iframe',
    [CAN_BE_EDITED]: true,
    grid,
    ...options
  }
}

export const carousel = function(options, grid) {
  return {
    [TAG]: CAROUSEL,
    [CAN_NEW_ITEM]: true,
    [CAN_BE_EDITED]: true,
    grid,
    [STYLES]: {
      html: {
        border: '1px solid #b5b9c1'
      }
    },
    [CHILDREN]: [
      // gridGenerator({
      //   [POLYMORPHISM]: 'indicators',
      //   [CAN_NOT_COPY]: true,
      //   [CAN_NOT_DELETE]: true,
      //   [SOFT_DELETE]: true,
      //   [CAN_NEW_ITEM]: false,
      //   [CHILDREN]: [
      //     {
      //       [GRID]: mapPoints(
      //         { x: 0, y: 0, w: 22, h: 71, unitW: '%', unitH: 'px' },
      //         grid
      //       ),
      //       [TAG]: GRID_GENERATOR_ITEM,
      //       [POLYMORPHISM]: 'prev',
      //       [CAN_NOT_COPY]: true,
      //       [CAN_NOT_DELETE]: true
      //     },
      //     {
      //       [GRID]: mapPoints(
      //         { x: 23, y: 0, w: 22, h: 71, unitW: '%', unitH: 'px' },
      //         grid
      //       ),
      //       [TAG]: GRID_GENERATOR_ITEM,
      //       [POLYMORPHISM]: 'next',
      //       [CAN_NOT_COPY]: true,
      //       [CAN_NOT_DELETE]: true
      //     }
      //   ]
      // }),
      slider(),
      slider()
    ]
  }
}

export const textEditor = function(options, grid) {
  return {
    [TAG]: TEXT_EDITOR,
    [CAN_BE_EDITED]: true,
    [VALUE]: 'text',
    [LABEL]: 'text',
    grid,
    ...options
  }
}

export const flexButton = function(options, grid) {
  return {
    [TAG]: 'flex-button',
    [LABEL]: 'button',
    [CAN_BE_EDITED]: true,
    grid,
    [STYLES]: {
      html: {
        border: '1px solid #dcdfe6',
        background: '#fff',
        textAlign: 'center'
      }
    }
    // children: [
    //   textEditor({
    //     [VALUE]: 'I can be changed to anything',
    //     [STYLES]: {
    //       [HTML]: { textAlign: 'center' }
    //     }
    //   })
    // ]
  }
}

export const flexImage = function(options, grid) {
  return {
    [TAG]: 'flex-image',
    [LABEL]: 'image',
    grid,
    ...options
  }
}

export const videoPlayer = function(options, grid) {
  return {
    [TAG]: 'video-player',
    [CAN_BE_EDITED]: true,
    [STYLES]: { ratioW: 16, ratioH: 9 },
    grid
  }
}

export const exampleMap = {
  [GRID_GENERATOR]: gridGenerator,
  [GRID_GENERATOR_ITEM]: gridGeneratorItem,
  [CAROUSEL]: carousel,
  [TEXT_EDITOR]: textEditor,
  'flex-button': flexButton,
  'flex-image': flexImage,
  'video-player': videoPlayer,
  slider,
  iframer,
  rectangle,
  group
}

export function getExample(tag, options = {}, grid) {
  return exampleMap[tag](options, grid)
}
