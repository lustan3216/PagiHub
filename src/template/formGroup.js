import { gridGenerator } from './basic'
import { formSlider, formCheckBox, formSubmit, formTextarea } from './form'

export const formGenerator = function() {
  return {
    tag: 'form-generator',
    children: [
      gridGenerator([
        {
          tag: 'grid-item',
          x: 0,
          y: 0,
          w: 33,
          h: 30,
          children: [formTextarea()]
        },
        {
          tag: 'grid-item',
          x: 0,
          y: 15,
          w: 22,
          h: 15,
          children: [formCheckBox()]
        },
        {
          tag: 'grid-item',
          x: 22,
          y: 0,
          w: 22,
          h: 15,
          children: [formSlider()]
        },
        {
          tag: 'grid-item',
          x: 0,
          y: 30,
          w: 15,
          h: 17,
          children: [formSubmit()]
        }
      ])
    ]
  }
}

export default function() {
  return {
    name: 'FormGroup',
    icon: 'el-icon-message',
    components: [formGenerator()]
  }
}
