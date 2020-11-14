<template>
  <el-button
    :icon="`el-icon-${isExist ? 's-tools' : 'circle-plus'}`"
    :type="type"
    :size="size"
    data-cy="component-set-create"
    @click.stop="visible = !visible"
  >
    {{ text }}

    <dialog-confirmable
      :visible.sync="visible"
      :loading="loading"
      :disable-submit="!dirty"
      :key="id"
      :title="title"
      width="80vw"
      class="dialog"
      @close="initData"
      @confirm="onSubmit"
    >
      <i
        v-shortkey="['esc']"
        @shortkey.propgate="visible = false"
      />

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
        label-position="top"
      >
        <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item
              label="Name"
              prop="label"
            >
              <el-input
                v-model="form.label"
                data-cy="component-set-name-input"
                placeholder="At least 3 letters"
              />
            </el-form-item>

            <p class="small-title">
              The name will be used as part of url, it can be browsed once
              publish.
            </p>

            <publish-link
              :id="id"
              :is-private="form.isPrivate"
              :component-set-label="form.label"
              changeable
              type="text"
            />

            <el-form-item
              label="Tag"
              prop="tag"
              class="m-t-20"
            >
              <select-tag
                v-model="form.tags"
                class="w-100"
              />
            </el-form-item>

            <el-form-item
              label="Is private"
              prop="isPrivate"
              class="m-t-20"
            >
              <el-checkbox v-model="form.isPrivate" />

              <span>
                Make url private and unsharable
              </span>
            </el-form-item>
          </el-col>

          <el-col
            :span="12"
            :offset="2"
          >
            <el-form-item
              label="Description"
              prop="description"
            >
              <text-editor-rich
                v-model="form.description"
                data-cy="component-set-desc-input"
                class="description"
              />
              <p class="small-title">
                Enter or select text has more functions.
              </p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <tip-page v-if="!node || !node.version" />
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { label } from '@/validator'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import SelectTag from '@/components/Components/SelectTag'
import { Message } from 'element-ui'
import TextEditorRich from '@/components/Components/TextEditorRich'
import TipPage from '@/components/Tip/TipPage'
import { cloneJson } from '@/utils/tool'
import PublishLink from '@/components/Components/PublishLink'

export default {
  name: 'DialogComponentSet',
  components: {
    DialogConfirmable,
    SelectTag,
    TextEditorRich,
    TipPage,
    PublishLink
  },
  props: {
    // eslint-disable-next-line
    id: {
      type: String
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'text'
    },
    text: {
      type: String,
      default: ''
    },
    firstTime: {
      type: Boolean,
      default: false
    },
    copyComponentSet: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      dirty: false,
      form: {
        label: '',
        description: '',
        tags: [],
        isPrivate: false
      },
      rules: {
        label
      }
    }
  },
  created() {
    if (this.node) {
      this.form.label = this.node.label
      this.form.description = this.node.description
      this.form.tags = this.node.tags
      this.form.isPrivate = this.node.isPrivate
    }

    this.rules.label = [...label, this.nameCheck]
  },
  computed: {
    ...mapState('node', ['editingProjectId']),
    componentSetIds() {
      const project = this.nodesMap[this.editingProjectId]
      return project ? project.children.map(node => node.id) : []
    },
    componentSetLabels() {
      // components可能會因為Example裡面的跟當下project的混在一起
      return this.componentSetIds.map(id => this.nodesMap[id].label.trim())
    },
    nameCheck() {
      const nameCheck = (rule, value, callback) => {
        if (this.node && this.node.label === value) {
          callback()
        }
        else if (this.componentSetLabels.includes(value.trim())) {
          callback(new Error('The name has been used'))
        }
        else {
          callback()
        }
      }
      return { required: true, validator: nameCheck, trigger: 'change' }
    },
    ...mapState('node', ['editingProjectId']),
    ...mapState('user', ['userId', 'username']),
    title() {
      if (this.copyComponentSet) {
        return `Copy a page from ${this.copyComponentSet.label}`
      }
      else {
        return this.firstTime
          ? "Let's build the first page"
          : 'A powerful page can reuse and share...'
      }
    },
    node() {
      return this.nodesMap[this.id]
    },
    project() {
      return this.nodesMap[this.editingProjectId]
    },
    isExist() {
      return Boolean(this.id)
    }
  },
  watch: {
    visible(value) {
      if (value && this.copyComponentSet) {
        this.form.label = this.copyComponentSet.label
        this.form.description = this.copyComponentSet.description
        this.form.tags = this.copyComponentSet.tags
      }

      if (value) {
        this.$emit('open')
      }
      else {
        this.$emit('close')
      }
    },
    form: {
      handler() {
        this.dirty = true
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('node', ['createComponentSet', 'patchComponentSet']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    open() {
      this.visible = true
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
              await this.createComponentSet({
                copyComponentSet: cloneJson(this.copyComponentSet),
                ...this.form
              })
              this.$emit('created')
            }
          }
          catch (e) {
            Message.warning(e.message)
            if (e instanceof Error) {
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
