export const flexSubmit = () => ({
  tag: 'flex-submit'
})

export const flexLabel = () => ({
  tag: 'flex-label'
})

export const flexReset = () => ({
  tag: 'flex-reset'
})

export const flexInput = () => ({
  tag: 'form-item',
  type: 'input',
  field: '商品名称',
  value: 'iphone 7',
  props: {
    type: 'text'
  },
  validate: [{ required: true, message: '请输入goods_name', trigger: 'blur' }]
})

export const flexTextarea = () => ({
  tag: 'form-item',
  type: 'input',
  field: '商品名称',
  value: 'iphone 7',
  props: {
    autosize: true,
    type: 'textarea'
  },
  validate: [{ required: true, message: '请输入商品名称', trigger: 'blur' }]
})

export const flexInputNumber = () => ({
  tag: 'form-item',
  type: 'InputNumber',
  field: '价格',
  value: 1,
  props: {
    precision: 2
  }
})

export const flexRadio = () => ({
  tag: 'form-item',
  type: 'radio',
  field: '是否包邮',
  value: '0',
  options: [
    { value: '0', label: '不包邮', disabled: false },
    { value: '1', label: '包邮', disabled: true }
  ]
})

export const flexCheckBox = () => ({
  tag: 'form-item',
  type: 'checkbox',
  field: '标签',
  value: ['1', '2', '3'],
  options: [
    { value: '1', label: '好用', disabled: true },
    { value: '2', label: '方便', disabled: false },
    { value: '3', label: '实用', disabled: false },
    { value: '4', label: '有效', disabled: false }
  ]
})

export const flexSelect = () => ({
  tag: 'form-item',
  type: 'select',
  field: '产品分类',
  value: ['104', '105'],
  options: [
    { value: '104', label: '生态蔬菜', disabled: false },
    { value: '105', label: '新鲜水果', disabled: false }
  ],
  props: {
    multiple: true
  }
})

export const flexSwitch = () => ({
  tag: 'form-item',
  type: 'switch',
  field: '是否上架',
  value: '1',
  props: {
    activeValue: '1',
    inactiveValue: '0'
  }
})

export const flexCascader = () => ({
  tag: 'form-item',
  type: 'cascader',
  field: '所在区域',
  value: ['陕西省', '西安市'],
  props: {
    options: ['陕西省', '西安市', '新城区']
  }
})

export const flexDatePicker = () => ({
  tag: 'form-item',
  type: 'DatePicker',
  field: '活动日期',
  value: ['2018-02-20', new Date()],
  props: {
    tag: 'form-item',
    type: 'datetimerange',
    format: 'yyyy-MM-dd HH:mm:ss',
    placeholder: '请选择活动日期'
  }
})

export const flexTimePicker = () => ({
  tag: 'form-item',
  type: 'TimePicker',
  field: '活动时间',
  value: [],
  props: {
    isRange: true
  }
})

export const flexColorPicker = () => ({
  tag: 'form-item',
  type: 'ColorPicker',
  field: '颜色',
  value: '#ff7271'
})

export const flexRate = () => ({
  tag: 'form-item',
  type: 'rate',
  field: '推荐级别',
  value: 3.5,
  props: {
    max: 10
  },
  validate: [
    {
      required: true,
      tag: 'form-item',
      type: 'number',
      min: 3,
      message: '请大于3颗星',
      trigger: 'change'
    }
  ]
})

export const flexSlider = () => ({
  tag: 'form-item',
  type: 'slider',
  field: '滑块',
  value: [0, 52],
  props: {
    min: 0,
    max: 100,
    range: true
  }
})

export default function() {
  return {
    name: 'Form',
    icon: 'el-icon-message',
    components: [
      flexLabel(),
      flexSubmit(),
      flexReset(),
      flexTextarea(),
      flexInput(),
      flexInputNumber(),
      flexRadio(),
      flexCheckBox(),
      flexSelect(),
      flexSwitch(),
      flexCascader(),
      flexDatePicker(),
      flexTimePicker(),
      flexColorPicker(),
      flexRate(),
      flexSlider()
    ]
  }
}
