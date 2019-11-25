export const formGenerator = function() {
  return {
    tag: 'form-generator',
    children: [
      {
        tag: 'grid-item',
        x: 0,
        y: 0,
        w: 33,
        h: 30,
        children: [
          {
            tag: 'form-item',
            type: 'input',
            field: 'test',
            title: 'test',
            value: ''
          }
        ]
      },
      {
        tag: 'grid-item',
        x: 0,
        y: 15,
        w: 22,
        h: 15,
        children: [
          {
            tag: 'form-item',
            type: 'radio',
            title: '是否包邮',
            field: '是否包邮',
            value: '0',
            options: [
              { value: '0', label: '不包邮', disabled: false },
              { value: '1', label: '包邮', disabled: true }
            ]
          }
        ]
      },
      {
        tag: 'grid-item',
        x: 22,
        y: 0,
        w: 22,
        h: 15,
        children: [
          {
            tag: 'form-item',
            type: 'input',
            title: '商品名称',
            field: '商品名称',
            value: 'iphone 7',
            props: {
              type: 'text'
            },
            validate: [
              { required: true, message: '请输入goods_name', trigger: 'blur' }
            ]
          }
        ]
      },
      {
        tag: 'grid-item',
        x: 0,
        y: 30,
        w: 15,
        h: 17,
        children: [
          {
            tag: 'flex-submit'
          }
        ]
      }
    ]
  }
}
export default {
  name: 'FormGroup',
  icon: 'el-icon-message',
  components: [formGenerator()]
}
