<template>
  <el-dialog
    v-if="visible"
    ref="dialog"
    v-bind="allProps"
    append-to-body
    destroy-on-close
    class="dialog"
    @close="close"
  >
    <template #title>
      <b
        v-if="title"
        class="el-dialog__title"
      >
        {{ title }}
      </b>
    </template>

    <slot />

    <template
      v-if="showFooter"
      #footer
    >
      <slot name="footer">
        <el-button
          size="small"
          type="text"
          class="m-r-15"
          @click="close"
        >
          Cancel
        </el-button>

        <el-button
          :disabled="disableSubmit"
          size="small"
          type="primary"
          @click="confirm"
        >
          {{ confirmText }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
let loading
export default {
  name: 'DialogConfirmable',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disableSubmit: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    }
  },
  computed: {
    allProps() {
      return { ...this.$props, ...this.$attrs }
    }
  },
  watch: {
    visible(value) {
      if (!value) {
        this.$emit('close')
      }
    },
    loading(value) {
      if (value) {
        loading = this.$loading({ target: this.$el.firstChild })
      }
      else {
        loading.close()
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.$emit('update:visible', false)
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped lang="scss">
.el-dialog__title {
  font-size: 30px;
  line-height: 35px;
}

::v-deep.dialog {
  .el-form-item__content {
    text-align: left;
  }
  .el-form-item__label {
    font-weight: bold;
    padding-bottom: 0;
  }
  .el-input__inner {
    background: #fafbfb;
  }

  .el-dialog {
    overflow: hidden;
    padding: 50px;
    max-width: 1000px;
    min-width: 600px;
    width: 100%;
    border-radius: 5px;
  }

  .el-dialog__footer {
    padding-top: 0;
  }
}
.flex1 {
  padding: 15px;
}
</style>
