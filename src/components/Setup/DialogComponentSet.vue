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
      title="Component"
      width="50%"
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
import { mapActions, mapState } from 'vuex'
import { label, max, min, required } from '@/validator'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import SelectTag from '@/components/Components/SelectTag'

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
    parentId: {
      type: String,
      required: true
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
    const { componentsMap } = this.$store.state.component

    const node = componentsMap[this.id]

    return {
      loading: false,
      visible: false,
      dirty: false,
      form: {
        label: node ? node.label : '',
        description: node ? node.description : '',
        tags: node ? node.tags : []
      },
      categories: [
        { id: 0, label: 'Button' },
        { id: 1, label: 'Form' },
        { id: 2, label: 'Layout' },
        { id: 3, label: 'Card' }
      ],
      rules: {
        label,
        description: [required],
        tags: [required, min(1), max(5)]
      }
    }
  },
  computed: {
    ...mapState('app', ['theOnlySelectedComponentId']),
    isExist() {
      return Boolean(this.id)
    },
    projectId() {
      return this.$route.params.projectId
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
    ...mapActions('component', ['createComponentSet', 'patchComponentSet']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid && this.dirty) {
          this.loading = true

          if (this.isExist) {
            await this.patchComponentSet({
              id: this.id,
              ...this.form
            })
          }
          else {
            await this.createComponentSet({
              projectId: this.projectId,
              ...this.form
            })
          }

          this.loading = false
          this.visible = false
          this.$bus.$emit('component-tabs-visible')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
