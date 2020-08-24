export const STYLE = 'style'

export const CHILDREN = 'children'
export const NAME = 'name'
export const PROPS = 'props'
export const VALIDATE = 'validate'
export const PARENT_ID = 'parentId'
export const COMPONENT_SET_ID = 'componentSetId'
export const ID = 'id'
export const MASTER_ID = 'masterId'
export const FIELD = 'field'
export const VALUE = 'value'
// type and name are the reserved words of dynamoDB, so change to kind and label
export const KIND = 'kind'

export const TAG = 'tag' // 拿來找vueComponent用的
export const KEY = 'key' // 有些vueComponent會被當曾別的應用，像是layer會被當曾artBoard, or grid 變成carousel indicator, 拿來特別辦事用
export const LABEL = 'label' // 前端顯示且可被修改的

export const CAN_NEW_ITEM = 'canNewItem'
export const CAN_BE_EDITED = 'canBeEdited'
export const CAN_NOT_DELETE = 'canNotDelete'
export const CAN_NOT_COPY = 'canNotCopy'
export const CAN_NOT_BE_MULTI_SELECTED = 'canNotBeMultiSelected'
export const AUTO_HEIGHT = 'autoHeight'
export const SOFT_DELETE = 'softDelete'
// it is used to define some action only happen at the firs time add
export const INITIATE = 'initiate'

export const TEXT_EDITOR = 'text-editor'
export const CAROUSEL = 'carousel'
export const LAYERS = 'layers'
export const COMPONENT_SET = 'component-set'
export const GRID_GENERATOR = 'grid-generator'
export const GRID_GENERATOR_ITEM = 'grid-generator-item'

export const COLUMNS = 96
export const COLUMN_OBJECT = {
  xxl: COLUMNS,
  xl: COLUMNS,
  lg: COLUMNS,
  md: COLUMNS,
  sm: COLUMNS,
  xs: COLUMNS,
  xxs: COLUMNS
}
export const BREAK_POINTS = {
  xxl: 1600,
  xl: 1440,
  lg: 1200,
  md: 992,
  sm: 768,
  xs: 568,
  xxs: 320
}

export const EXAMPLE = 'EXAMPLE' // need to uppercase separate id of different types
// 01EDEHZQ2M9V8X4VZ7HEFJ1R0A could be project or componentSet
// 12a01EDEHZQ2M9V8X4VZ7HEFJ1R0A is component
// 12aEXAMPLE is example

export const SORT_INDEX = 'sortIndex'
export const PATH = 'path'

export const NODE_TYPE = {
  PROJECT: 'p',
  FOLDER: 1,
  COMPONENT_SET: 's',
  COMPONENT: undefined
}

export const STYLE_STATE = {
  none: 0,
  hover: 1,
  click: 2
}

export const NODE_TYPE_STRING = {
  [NODE_TYPE.PROJECT]: 'project',
  [NODE_TYPE.FOLDER]: 'folder',
  [NODE_TYPE.COMPONENT_SET]: 'componentSet',
  [NODE_TYPE.COMPONENT]: 'component'
}
