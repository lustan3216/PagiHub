import { ICON, ID, NAME, CATEGORY } from '../const'
import { exampleIds } from '../utils/keyId'
import basic from './basic'
import formItem from './formItem'
import formGroup from './formGroup'

export const FORM_ITEM_ID = 1

export const categories = [
  {
    [ID]: 0,
    [NAME]: 'Basic',
    [ICON]: 'el-icon-message'
  },
  {
    [ID]: FORM_ITEM_ID,
    [NAME]: 'FormItem',
    [ICON]: 'el-icon-message'
  },
  {
    [ID]: 2,
    [NAME]: 'FormGroup',
    [ICON]: 'el-icon-message'
  }
]

const assignCategoryId = (array, id) => array.map(x => (x[CATEGORY] = [id]))

export default function() {
  assignCategoryId(basic, 0)
  assignCategoryId(formItem, FORM_ITEM_ID)
  assignCategoryId(formGroup, 2)

  const allComponents = [...basic, ...formItem, ...formGroup]

  exampleIds.appendIdNested(allComponents)

  return allComponents
}
