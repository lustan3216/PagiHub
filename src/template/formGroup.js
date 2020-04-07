import { GRID_ITEM, TAG, CHILDREN, CAN_NEW_ITEM } from '../const'
import { formSlider, formCheckBox, formSubmit, formTextarea } from './formItem'

export const formGenerator = function() {
  return {
    [TAG]: 'form-generator',
    [CAN_NEW_ITEM]: true,
    [CHILDREN]: [
      {
        [TAG]: GRID_ITEM,
        x: 0,
        y: 0,
        w: 33,
        h: 30,
        [CHILDREN]: [formTextarea()]
      },
      {
        [TAG]: GRID_ITEM,
        x: 0,
        y: 15,
        w: 22,
        h: 15,
        [CHILDREN]: [formCheckBox()]
      },
      {
        [TAG]: GRID_ITEM,
        x: 22,
        y: 0,
        w: 22,
        h: 15,
        [CHILDREN]: [formSlider()]
      },
      {
        [TAG]: GRID_ITEM,
        x: 0,
        y: 30,
        w: 15,
        h: 17,
        [CHILDREN]: [formSubmit()]
      }
    ]
  }
}

export default [formGenerator()]
