<template>
  <el-button
    :icon="`el-icon-${isExist ? 's-tools' : 'plus'}`"
    v-bind="$attrs"
    @click.stop="visible = !visible"
  >
    {{ buttonText }}
    <dialog-confirmable
      :visible.sync="visible"
      :disable-submit="!dirty"
      title="Website"
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
        <el-form-item
          label="Name"
          prop="label"
        >
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

        <template v-if="!isExist">
          <el-form-item
            label="Tag"
            prop="tag"
          >
            <select-tag
              v-model="form.tags"
              class="w-100"
            />
          </el-form-item>
          <span>You can create tag but limitation is 5.</span>
        </template>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import SelectTag from '@/components/Components/SelectTag'
import { mapActions } from 'vuex'
import { label, required, min, max } from '@/validator'

export default {
  name: 'DialogWebsite',
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
    const { componentsMap } = this.$store.state.node
    const node = componentsMap[this.id]
    return {
      visible: false,
      dirty: false,
      form: {
        label: node ? node.label : '',
        description: node ? node.description : '',
        tags: node ? node.tags : []
      },
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
    ...mapActions('node', ['createWebsite', 'patchWebsite']),
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid && this.dirty) {
          if (this.isExist) {
            this.patchWebsite({
              id: this.id,
              ...this.form
            })
          }
          else {
            const project = await this.createWebsite(this.form)
            this.$router.push(`/${project.id}/draft`)
          }

          this.form = {
            label: '',
            description: '',
            tags: []
          }
          this.visible = false
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
