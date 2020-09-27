<template>
  <el-button
    :icon="`el-icon-${isExist ? 's-tools' : 'circle-plus'}`"
    :type="type"
    :size="size"
    @click.stop="visible = !visible"
  >
    {{ text }}
    <dialog-confirmable
      :visible.sync="visible"
      :loading="loading"
      :disable-submit="!dirty"
      title="Now, about your project..."
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
            >https://lots.design/{{ username || 'username' }}/{{
              form.label || 'project-name'
            }}/page-name</a>

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
        <tip-tag-desc />
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import SelectTag from '@/components/Components/SelectTag'
import TextEditorRich from '@/components/Components/TextEditorRich'
import TipTagDesc from '@/components/Tip/TipTagDesc'
import { mapActions, mapState } from 'vuex'
import { label } from '@/validator'

export default {
  name: 'DialogProject',
  components: {
    DialogConfirmable,
    SelectTag,
    TipTagDesc,
    TextEditorRich
  },
  props: {
    id: {
      type: String,
      default: ''
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
      visible: false,
      dirty: false,
      form: {
        label: node ? node.label : '',
        description: node ? node.description : '',
        tags: node ? node.tags : []
      },
      rules: {
        label
      },
      loading: false
    }
  },
  computed: {
    ...mapState('user', ['userId', 'username']),
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
    ...mapActions('node', ['createProject', 'patchProject']),
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid && this.dirty) {
          try {
            this.loading = true
            if (this.isExist) {
              this.patchProject({
                id: this.id,
                ...this.form
              })
            }
            else {
              await this.createProject(this.form)
            }

            this.form = {
              label: '',
              description: '',
              tags: []
            }
            this.visible = false
          }
          finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
