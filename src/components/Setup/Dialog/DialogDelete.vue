<template>
  <el-button
    icon="el-icon-delete"
    type="text"
    @click.stop="visible = !visible"
  >
    <dialog-confirmable
      :visible.sync="visible"
      title="Component"
      width="30%"
      @confirm="onSubmit"
      @close="initData"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="110px"
      >
        <el-form-item
          label="Name"
          prop="name"
        >
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { mapActions } from 'vuex'
import { required } from '../../../validator'
import DialogConfirmable from '../../Components/DialogConfirmable'

export default {
  name: 'DialogSettingComponent',
  components: {
    DialogConfirmable
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    const name = this.$store.state.project.projectMap[this.id].name

    return {
      visible: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          required,
          {
            pattern: new RegExp(`^${name}$`),
            message: 'The name is not correct to delete'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions('project', ['deleteProjectNode']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.deleteProjectNode(this.id)
          this.visible = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
