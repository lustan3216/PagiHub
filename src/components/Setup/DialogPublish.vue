<template>
  <el-button
    :disabled="!editingComponentSetId"
    type="text"
    @click.stop="visible = !visible"
  >
    <b-icon-cloud-upload/>

    <dialog-confirmable
      :loading="loading"
      :visible.sync="visible"
      title="Publish"
      width="50%"
      @close="initData"
      @confirm="onSubmit"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="110px"
      >
        <el-form-item label="Version">
          <el-input
            :value="version"
            readonly
          />
        </el-form-item>

        <el-form-item label="Description">
          <text-editor-rich
            v-model="form.description"
            class="description"
          />

          <p class="small-title">
            It is private for note.
          </p>
        </el-form-item>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import TextEditorRich from '@/components/Components/TextEditorRich'
import { BIconCloudUpload } from 'bootstrap-vue'
import { Message } from 'element-ui'

export default {
  name: 'DialogPublish',
  components: {
    DialogConfirmable,
    TextEditorRich,
    BIconCloudUpload
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        description: ''
      }
    }
  },
  computed: {
    ...mapState('node', ['editingComponentSetId']),
    node() {
      return this.nodesMap[this.editingComponentSetId]
    },
    version() {
      return (this.node && this.node.version) || 1
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.form.description = this.node.publishDescription || ''
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
    ...mapActions('node', ['publishComponentSet']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid && this.dirty) {
          try {
            this.loading = true
            await this.publishComponentSet(this.form.description)
            Message.success('Publish Success')
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
