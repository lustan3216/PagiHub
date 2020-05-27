export const STYLE = 'style'
export const TAG = 'tag'
export const CHILDREN = 'children'
export const NAME = 'name'
export const PROPS = 'props'
export const VALIDATE = 'validate'
export const PARENT_ID = 'parentId'
export const ID = 'id'
export const MASTER_ID = 'masterId'
export const FIELD = 'field'
export const VALUE = 'value'

export const CAN_NEW_ITEM = 'canNewItem'
export const CAN_EDIT = 'canEditText'
export const CAN_DRAG = 'canDrag'
export const CAN_NOT_DELETE = 'canNotDelete'
export const CAN_NOT_COPY = 'canNotCopy'
export const CAN_NOT_BE_MULTI_SELECTED = 'canNotBeMultiSelected'
export const AUTO_HEIGHT = 'autoHeight'
export const SOFT_DELETE = 'softDelete'
// it is used to define some action only happen at the firs time add
export const INITIATE = 'initiate'

export const LAYERS = 'layers'
export const COMPONENT_SET = 'component-set'
export const GRID_GENERATOR = 'grid-generator'
export const GRID_ITEM = 'grid-item'
export const GRID_ITEM_CHILD = 'grid-item-child'

export const SORT_INDEX = 'sortIndex'
export const PATH = 'path'

export const NODE_TYPE = {
  PROJECT: 0,
  FOLDER: 1,
  COMPONENT_SET: 2,
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
