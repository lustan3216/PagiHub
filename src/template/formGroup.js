import { gridGenerator } from './basic'
import { TAG, CHILDREN } from '../const'
import { formSlider, formCheckBox, formSubmit, formTextarea } from './formItem'

export const formGenerator = function() {
  return {
    [TAG]: 'form-generator',
    [CHILDREN]: [
      gridGenerator([
        {
          [TAG]: 'grid-item',
          x: 0,
          y: 0,
          w: 33,
          h: 30,
          [CHILDREN]: [formTextarea()]
        },
        {
          [TAG]: 'grid-item',
          x: 0,
          y: 15,
          w: 22,
          h: 15,
          [CHILDREN]: [formCheckBox()]
        },
        {
          [TAG]: 'grid-item',
          x: 22,
          y: 0,
          w: 22,
          h: 15,
          [CHILDREN]: [formSlider()]
        },
        {
          [TAG]: 'grid-item',
          x: 0,
          y: 30,
          w: 15,
          h: 17,
          [CHILDREN]: [formSubmit()]
        }
      ])
    ]
  }
}

export default [formGenerator()]
