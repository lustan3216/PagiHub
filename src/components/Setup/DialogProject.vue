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
      :key="id"
      title="Now, about your project..."
      width="80vw"
      class="dialog"
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
              <!-- componentSet裡面有記錄 projectName，為了懶惰不更改所以這邊暫時鎖住 -->
              <el-input
                v-model="form.label"
                :disabled="isExist"
                data-cy="project-name-input"
                placeholder="At least 3 letters"
              />
            </el-form-item>

            <p class="small-title">
              The project name will be part of url which is <b>unchangeable</b>.
              In addition, it can be browsed when published.
            </p>
            <span
              :style="{ cursor: 'default' }"
              class="link font-13"
            >
              {{ exampleUrl }}
            </span>

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
                data-cy="project-description-input"
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
    return {
      visible: false,
      dirty: false,
      form: {
        label: '',
        description: '',
        tags: []
      },
      rules: {
        label
      },
      loading: false
    }
  },
  created() {
    if (this.node) {
      this.form.label = this.node.label
      this.form.description = this.node.description
      this.form.tags = this.node.tags
    }

    this.rules.label = [...label, this.nameCheck]
  },
  computed: {
    ...mapState('user', ['userId', 'username']),
    node() {
      return this.nodesMap[this.id]
    },
    exampleUrl() {
      return `https://lots.design/${this.username || 'username'}/${this.form
        .label || 'project-name'}/page-name`
    },
    isExist() {
      return Boolean(this.id)
    },
    ...mapState('node', ['projectIds']),
    projectLabels() {
      // components可能會因為Example裡面的跟當下project的混在一起
      return this.projectIds.map(id => this.nodesMap[id].label.trim())
    },
    nameCheck() {
      const nameCheck = (rule, value, callback) => {
        if (this.node && this.node.label === value) {
          callback()
        }
        else if (this.projectLabels.includes(value.trim())) {
          callback(new Error('The name has been used'))
        }
        else {
          callback()
        }
      }
      return { required: true, validator: nameCheck, trigger: 'change' }
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
