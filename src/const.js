export const CHILDREN = 'children'
export const GRID = 'grid'
export const PROPS = 'props'
export const STYLES = 'styles'
export const MASTER_PROPS = 'masterProps'
export const MASTER_STYLES = 'masterStyles'
export const MASTER_VALUE = 'masterValue'
export const VALIDATE = 'validate'
export const PARENT_ID = 'parentId'
export const COMPONENT_SET_ID = 'componentSetId'
export const ID = 'id'
export const MASTER_ID = 'masterId'
export const FIELD = 'field'
export const VALUE = 'value'
// type and name are the reserved words of dynamoDB, so change to kind and label
export const KIND = 'kind'
export const HTML = 'html'

export const TAG = 'tag' // 拿來找vueComponent用的
export const POLYMORPHISM = 'polymorphism' // 有些vueComponent會被當曾別的應用，像是layer會被當曾artBoard, or grid 變成carousel indicator, 拿來特別辦事用
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

export const COLUMNS = 72
// export const COLUMN_OBJECT = {
//   xl: 72,
//   lg: 72,
//   md: 72,
//   sm: 72,
//   xs: 72,
//   xxs: 72
// }

export const BREAK_POINT_KEYS = ['xl', 'lg', 'md', 'sm', 'xs', 'xxs']

export const BREAK_POINTS = {
  xl: 1440,
  lg: 1200,
  md: 992,
  sm: 768,
  xs: 568,
  xxs: 320
}

export const SORT_INDEX = 'sortIndex'
export const PATH = 'path'

export const NODE_TYPE = {
  PROJECT: 'project',
  PAGE: 'page',
  FOLDER: 1,
  COMPONENT_SET: 'component-set',
  DESIGN: 'design',
  COMPONENT: undefined
}
