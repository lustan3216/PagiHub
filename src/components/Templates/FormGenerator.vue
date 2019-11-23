<template>
  <form-create v-model="fApi" :rule="rule" :option="option" />
</template>

<script>
import formCreate from '@form-create/element-ui'
export default {
  name: 'FormGenerator',
  components: {
    formCreate: formCreate.$form()
  },
  data() {
    return {
      fApi: {},
      rule: [
        {
          type: 'input',
          field: 'test-1',
          title: 'col-12',
          value: '',
          col: {
            span: 12
          }
        },
        {
          type: 'input',
          field: 'test-2',
          title: 'col-12',
          value: '',
          col: {
            span: 12
          }
        },
        {
          type: 'input',
          field: 'test',
          title: 'test',
          value: '',
          props: {
            disabled: false
          },
          emit: ['on-change']
        }
      ],
      option: {
        // 表单提交事件
        onSubmit: function(formData) {
          alert(JSON.stringify(formData))
        }
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
