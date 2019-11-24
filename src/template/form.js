const basic = require('./basic')

export const flexSubmit = () => ({
  tag: 'flexSubmit'
})

export const flexInput = () => ({
  type: 'input',
  title: '商品名称',
  field: 'goods_name',
  value: 'iphone 7',
  col: {
    span: 12,
    labelWidth: 150
  },
  props: {
    type: 'text'
  },
  validate: [{ required: true, message: '请输入goods_name', trigger: 'blur' }]
})

export const flexInputNumber = () => ({
  type: 'InputNumber',
  field: 'price',
  title: '价格',
  value: 1,
  props: {
    precision: 2
  }
})

export const flexRadio = () => ({
  type: 'radio',
  title: '是否包邮',
  field: 'is_postage',
  value: '0',
  options: [
    { value: '0', label: '不包邮', disabled: false },
    { value: '1', label: '包邮', disabled: true }
  ]
})

export const flexCheckBox = () => ({
  type: 'checkbox',
  title: '标签',
  field: 'label',
  value: ['1', '2', '3'],
  options: [
    { value: '1', label: '好用', disabled: true },
    { value: '2', label: '方便', disabled: false },
    { value: '3', label: '实用', disabled: false },
    { value: '4', label: '有效', disabled: false }
  ]
})

export const flexSelect = () => ({
  type: 'select',
  field: 'cate_id',
  title: '产品分类',
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
  type: 'switch',
  title: '是否上架',
  field: 'is_show',
  value: '1',
  props: {
    activeValue: '1',
    inactiveValue: '0'
  }
})

export const flexCascader = () => ({
  type: 'cascader',
  title: '所在区域',
  field: 'address',
  value: ['陕西省', '西安市'],
  props: {
    options: ['陕西省', '西安市', '新城区']
  }
})

export const flexDatePicker = () => ({
  type: 'DatePicker',
  field: 'section_day',
  title: '活动日期',
  value: ['2018-02-20', new Date()],
  props: {
    type: 'datetimerange',
    format: 'yyyy-MM-dd HH:mm:ss',
    placeholder: '请选择活动日期'
  }
})

export const flexTimePicker = () => ({
  type: 'TimePicker',
  field: 'section_time',
  title: '活动时间',
  value: [],
  props: {
    isRange: true
  }
})

export const flexColorPicker = () => ({
  type: 'ColorPicker',
  field: 'color',
  title: '颜色',
  value: '#ff7271'
})

export const flexRate = () => ({
  type: 'rate',
  field: 'rate',
  title: '推荐级别',
  value: 3.5,
  props: {
    max: 10
  },
  validate: [
    {
      required: true,
      type: 'number',
      min: 3,
      message: '请大于3颗星',
      trigger: 'change'
    }
  ]
})

export const flexSlider = () => ({
  type: 'slider',
  field: 'slider',
  title: '滑块',
  value: [0, 52],
  props: {
    min: 0,
    max: 100,
    range: true
  }
})

export const flexTree = () => ({
  type: 'tree',
  title: '权限',
  field: 'rule',
  value: [],
  props: {
    data: [],
    props: {
      label: 'title'
    }
  }
})

export default [
  {
    name: 'Form',
    icon: 'el-icon-message',
    components: [
      // flexSubmit(),
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
      flexSlider(),
      flexTree()
    ]
  },
  {
    name: 'Basic',
    icon: 'el-icon-message',
    components: [
      basic.flexButton(),
      basic.lazyImage(),
      basic.gridGenerator(),
      basic.carousel(),
      basic.divider(),
      basic.videoPlayer(),
      basic.editor(),
      basic.card()
    ]
  }
]
