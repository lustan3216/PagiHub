<template>
  <el-button
    :icon="`el-icon-${isExist ? 's-tools' : 'circle-plus-outline'}`"
    :type="buttonType"
    @click.stop="visible = !visible"
  >
    {{ buttonText }}
    <dialog-confirmable
      :loading="loading"
      :visible.sync="visible"
      :disable-submit="!dirty"
      width="50%"
      title="Design"
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
          v-if="!isExist"
          label="Project"
          prop="parentId"
        >
          <el-select v-model="form.parentId">
            <el-option
              v-for="project in projectNodes"
              :key="project.id"
              :value="project.id"
              :label="project.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Name"
          prop="label"
        >
          <el-input v-model="form.label" />
        </el-form-item>

        <el-form-item
          label="Tag"
          prop="tag"
        >
          <select-tag
            v-model="form.tags"
            class="w-100"
          />
        </el-form-item>

        <el-form-item label="Description">
          <el-input
            :autosize="{ minRows: 3 }"
            v-model="form.description"
            type="textarea"
          />
        </el-form-item>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { label, max, min, required } from '@/validator'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import SelectTag from '@/components/Components/SelectTag'
import { Message } from 'element-ui'

export default {
  name: 'DialogComponentSet',
  components: {
    DialogConfirmable,
    SelectTag
  },
  props: {
    // eslint-disable-next-line
    id: {
      type: String
    },
    buttonType: {
      type: String,
      default: 'text'
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
      loading: false,
      visible: false,
      dirty: false,
      form: {
        label: node ? node.label : '',
        description: node ? node.description : '',
        tags: node ? node.tags : [],
        parentId: null
      },
      categories: [
        { id: 0, label: 'Button' },
        { id: 1, label: 'Form' },
        { id: 2, label: 'Layout' },
        { id: 3, label: 'Card' }
      ],
      rules: {
        label,
        parentId: [required],
        description: [required],
        tags: [required, min(1), max(5)]
      }
    }
  },
  computed: {
    ...mapState('node', ['editingProjectId']),
    ...mapGetters('node', ['projectNodes']),
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
  created() {
    this.form.parentId = this.editingProjectId
  },
  methods: {
    ...mapActions('node', ['createComponentSet', 'patchComponentSet']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid && this.dirty) {
          try {
            this.loading = true

            if (this.isExist) {
              await this.patchComponentSet({
                id: this.id,
                ...this.form
              })
            }
            else {
              await this.createComponentSet(this.form)
            }
          }
          catch (e) {
            Message.warning(e.message)
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
