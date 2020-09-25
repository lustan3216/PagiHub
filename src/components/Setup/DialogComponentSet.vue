<template>
  <el-button
    :icon="`el-icon-${isExist ? 's-tools' : 'circle-plus-outline'}`"
    :type="type"
    :size="size"
    @click.stop="visible = !visible"
  >
    {{ text }}
    <dialog-confirmable
      :visible.sync="visible"
      :loading="loading"
      :disable-submit="!dirty"
      title="A powerful page can reuse and share..."
      width="80vw"
      class="dialog"
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
                placeholder="At least 6 letters"
              />
            </el-form-item>

            <p class="small-title">
              The name will be used as part of url, it can be browsed once
              publish.
            </p>
            <a
              class="link font-13"
            >https://lots.design/{{ username || userId }}/{{
              project && project.label
            }}/{{ form.label || 'page-name' }}</a>

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
            <p class="small-title">
              Nice tags can be easier to search and categorize by you or others.
            </p>
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
                class="description"
              />
              <p class="small-title">
                Enter or select text has more functions.
              </p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!--      <div>-->
      <!--        <div>Tip</div>-->
      <!--        You have not chosen username yet, it can make url prettier and easy-->
      <!--        remember by changing user-id to username.-->
      <!--      </div>-->
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { label, max, min, required } from '@/validator'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import SelectTag from '@/components/Components/SelectTag'
import { Message } from 'element-ui'
import TextEditorRich from '@/components/Components/TextEditorRich'
import { getNode } from '@/utils/node'
export default {
  name: 'DialogComponentSet',
  components: {
    DialogConfirmable,
    SelectTag,
    TextEditorRich
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
    }
  },
  data() {
    const { nodesMap } = this.$store.state.node

    const node = nodesMap[this.id]

    return {
      loading: false,
      visible: false,
      dirty: false,
      form: {
        label: node ? node.label : '',
        description: node ? node.description : '',
        tags: node ? node.tags : []
      },
      rules: {
        label
      }
    }
  },
  computed: {
    ...mapState('node', ['editingProjectId']),
    ...mapState('user', ['userId', 'username']),
    project() {
      return getNode(this.editingProjectId)
    },
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
