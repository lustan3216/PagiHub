import { gridGenerator } from './basic'
import { flexSlider, flexCheckBox, flexSubmit, flexTextarea } from './form'

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
          children: [flexTextarea()]
        },
        {
          tag: 'grid-item',
          x: 0,
          y: 15,
          w: 22,
          h: 15,
          children: [flexCheckBox()]
        },
        {
          tag: 'grid-item',
          x: 22,
          y: 0,
          w: 22,
          h: 15,
          children: [flexSlider()]
        },
        {
          tag: 'grid-item',
          x: 0,
          y: 30,
          w: 15,
          h: 17,
          children: [flexSubmit()]
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
