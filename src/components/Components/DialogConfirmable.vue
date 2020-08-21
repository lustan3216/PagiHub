<template>
  <el-dialog
    v-if="visible"
    ref="dialog"
    v-bind="allProps"
    append-to-body
    destroy-on-close
    class="dialog"
    @close="$emit('update:visible', false)"
  >
    <template #title>
      <span
        v-if="title"
        class="el-dialog__title"
      >
        {{ title }}
      </span>
    </template>

    <slot />

    <template
      v-if="showFooter"
      #footer
    >
      <div class="flex">
        <slot name="footer">
          <el-button
            size="large"
            style="margin-right: -1px;"
            class="flex1 no-radius"
            @click="$emit('update:visible', false)"
          >
            Cancel
          </el-button>

          <el-button
            :disabled="disableSubmit"
            size="large"
            class="flex1 no-radius m-0"
            plain
            @click="confirm"
          >
            Confirm
          </el-button>
        </slot>
      </div>
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
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped lang="scss">
.el-dialog__title {
  font-size: 24px;
  text-transform: uppercase;
  text-align: center;
}

::v-deep.dialog {
  .el-dialog__header {
    text-align: center;
  }

  .el-form-item__content {
    text-align: left;
  }

  .el-dialog {
    border-radius: 5px;
    overflow: hidden;
  }

  .el-dialog__footer {
    padding: 0;
  }
}
.flex1 {
  padding: 15px;
}
</style>
