import { ICON, ID, NAME, CATEGORY } from '../const'
import { exampleIds } from '../utils/keyId'
import basic from './basic'
import formItem from './formItem'

export const FORM_ITEM_ID = 1

export const categories = [
  {
    [ID]: 0,
    [NAME]: 'Basic',
    [ICON]: 'el-icon-message'
  }
]

const assignCategoryId = (array, id) => array.map(x => (x[CATEGORY] = [id]))

export default function() {
  const all = [...basic, ...formItem]
  assignCategoryId(all, 0)

  exampleIds.appendIdNested(all)

  return all
}
