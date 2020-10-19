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
      :title="
        firstTime
          ? 'Let we build the first page'
          : 'A powerful page can reuse and share...'
      "
      width="80vw"
      class="dialog"
      @close="initData"
      @confirm="onSubmit"
    >
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
            <component
              :is="node && node.version ? 'router-link' : 'span'"
              :to="`/${username}/${project && project.label}/${form.label}`"
              :class="[node && node.version ? 'link' : 'gray-font']"
              class="font-13"
            >
              {{ origin }}/{{ username || 'username' }}/{{
                project && project.label
              }}/{{ form.label || 'page-name' }}{{ privateLinkToken }}
            </component>

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
import { getNode } from '@/utils/node'

export default {
  name: 'DialogComponentSet',
  components: {
    DialogConfirmable,
    SelectTag,
    TextEditorRich,
    TipPage
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
  },
  computed: {
    ...mapState('node', ['editingProjectId']),
    ...mapState('user', ['userId', 'username']),
    origin() {
      return location.origin
    },
    node() {
      return this.nodesMap[this.id]
    },
    project() {
      return getNode(this.editingProjectId)
    },
    isExist() {
      return Boolean(this.id)
    },
    privateLinkToken() {
      if (this.form.isPrivate) {
        if (this.node && this.node.privateLinkToken) {
          return `?privateLinkToken=${this.node.privateLinkToken}`
        }
        else {
          return `?privateLinkToken=secret`
        }
      }
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
              await this.createComponentSet(this.form)
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
