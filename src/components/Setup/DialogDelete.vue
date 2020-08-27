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
      :title="`Delete ${type}`"
      width="30%"
      @confirm="onSubmit"
      @close="initData"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
      >
        <p>
          Please enter
          <b>{{ label }}</b>
          to confirm the project you want to delete.
        </p>
        <el-form-item prop="label">
          <el-input v-model="form.label" />
        </el-form-item>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { mapActions } from 'vuex'
import { required } from '@/validator'
import { capitalize } from '@/utils/string'
import { KIND } from '@/const'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import { isComponentSet } from '@/utils/node'

export default {
  name: 'DialogDelete',
  components: {
    DialogConfirmable
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    const node = this.$store.state.node.componentsMap[this.id]
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
      return capitalize(this.node[KIND])
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
          this.loading = true
          if (isComponentSet(this.node)) {
            await this.deleteComponentSet(this.id)
          }
          else {
            await this.deleteProjectNode(this.id)
          }
          // this.loading = false
          // this.visible = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
