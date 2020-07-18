<template>
  <el-button
    v-bind="$attrs"
    :icon="`el-icon-${isExist ? 's-tools' : 'plus'}`"
    type="text"
    @click.stop="visible = !visible"
  >
    {{ buttonText }}
    <dialog-confirmable
      :visible.sync="visible"
      :disable-submit="!dirty"
      title="Project"
      width="50vw"
      class="dialog"
      @confirm="onSubmit"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="Name" prop="label">
          <el-input v-model="form.label" />
        </el-form-item>

        <el-form-item
          label="Description"
          prop="description"
        >
          <el-input
            :autosize="{ minRows: 3 }"
            v-model="form.description"
            type="textarea"
          />
        </el-form-item>

        <el-form-item label="Tag" prop="tag">
          <select-tag
            v-model="form.tags"
            class="w-100"
          />
        </el-form-item>
        <span>You can create tag but limitation is 5.</span>

        <!--        <el-form-item label="Auto Update">-->
        <!--          <el-checkbox v-model="form.autoUpdate" />-->
        <!--        </el-form-item>-->
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import SelectTag from '@/components/Components/SelectTag'
import { mapActions } from 'vuex'
import { NODE_TYPE } from '@/const'
import { label, required, min, max } from '@/validator'

export default {
  name: 'DialogProject',
  components: {
    DialogConfirmable,
    SelectTag
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    }
  },
  data() {
    const { projectMap } = this.$store.state.project

    const form = {
      label: '',
      description: '',
      type: NODE_TYPE.PROJECT,
      tags: []
    }

    if (this.id) {
      Object.assign(form, projectMap[this.id])
    }

    return {
      visible: false,
      dirty: false,
      form,
      rules: {
        label,
        description: [required],
        tags: [required, min(1), max(5)]
      }
    }
  },
  computed: {
    isExist() {
      return Boolean(this.id)
    }
  },
  watch: {
    form: {
      handler() {
        this.dirty = true
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('project', ['createProject', 'patchProject']),
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid && this.dirty) {
          if (this.isExist) {
            this.patchProject({
              id: this.id,
              ...this.form
            })
          } else {
            const project = await this.createProject(this.form)
            this.$router.push(`/${project.id}/draft`)
          }

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
