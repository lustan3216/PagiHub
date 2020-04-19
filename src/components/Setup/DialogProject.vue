<template>
  <el-button
    type="text"
    icon="el-icon-s-tools"
    @click.stop="visible = !visible"
  >
    <dialog-confirmable
      :visible.sync="visible"
      title="Project"
      width="30%"
      class="dialog"
      @confirm="onSubmit"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="110px"
      >
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="Description">
          <el-input
            :autosize="{ minRows: 3 }"
            v-model="form.description"
            type="textarea"
          />
        </el-form-item>

        <el-form-item label="Auto Update">
          <el-checkbox v-model="form.autoUpdate" />
        </el-form-item>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import DialogConfirmable from '../Components/DialogConfirmable'
import { mapActions, mapState } from 'vuex'
import { TYPE } from '../../const'

export default {
  name: 'DialogProject',
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
    return {
      visible: false,
      form: {
        name: '',
        autoUpdate: true,
        description: '',
        categories: [],
        type: TYPE.PROJECT
      },
      categories: [
        { id: 0, label: 'Button' },
        { id: 1, label: 'Form' },
        { id: 2, label: 'Layout' },
        { id: 3, label: 'Card' }
      ]
    }
  },
  computed: {
    ...mapState('project', ['projectMap']),
    isExist() {
      return Boolean(this.id)
    }
  },
  created() {
    if (this.id) {
      Object.assign(this.form, this.projectMap[this.id])
    }
  },
  methods: {
    ...mapActions('project', ['appendProjectNode']),
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.appendProjectNode(this.form)
          this.visible = false
          this.$refs.form.resetFields()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.dialog {
  .el-dialog__header {
    text-align: center;
  }

  .el-dialog__title {
    font-size: 24px;
    text-transform: uppercase;
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
