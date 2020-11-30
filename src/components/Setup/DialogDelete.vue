<template>
  <el-button
    v-bind="$attrs"
    icon="el-icon-delete"
    type="text"
    @click.stop="visible = !visible"
  >
    <dialog-confirmable
      :loading="loading"
      :visible.sync="visible"
      :title="`Bye ${type}`"
      width="30%"
      @confirm="onSubmit"
      @close="initData"
    >
      <i
        v-shortkey="['esc']"
        @shortkey.propgate="visible = false"
      />

      <el-form
        ref="form"
        :rules="rules"
        :model="form"
      >
        <el-form-item prop="label">
          <el-input
            v-model="form.label"
            :placeholder="label"
          />
        </el-form-item>

        <p>
          Please enter project name
          <b>{{ label }}</b>
          to confirm delete.
        </p>
      </el-form>

      <tip-delete :name="label" />
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { mapActions } from 'vuex'
import { required } from '@/validator'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import { isComponentSet } from '@/utils/node'
import TipDelete from '@/components/Tip/TipDelete'
import { Message } from 'element-ui'

export default {
  name: 'DialogDelete',
  components: {
    DialogConfirmable,
    TipDelete
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    const node = this.$store.state.node.nodesMap[this.id]
    const { label } = node

    return {
      loading: false,
      node,
      label,
      visible: false,
      form: {
        label: ''
      },
      rules: {
        label: [
          required,
          {
            pattern: new RegExp(`^${label}$`),
            message: 'The name is not correct to delete'
          }
        ]
      }
    }
  },
  computed: {
    type() {
      return this.node.label
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.$emit('open')
      }
      else {
        this.$emit('close')
      }
    }
  },
  methods: {
    ...mapActions('node', ['deleteProjectNode', 'deleteComponentSet']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            if (isComponentSet(this.node)) {
              await this.deleteComponentSet(this.id)
            }
            else {
              await this.deleteProjectNode(this.id)
            }

            Message.info('Delete Success')
          }
          catch (e) {
            if (e.response.status < 500) {
              Message.info(e.response.data.message)
            }
            else {
              Message.error('Bomb! Has an error, we are fixing this ASAP')
              throw e
            }
          }
          finally {
            this.loading = false
            this.visible = false
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
