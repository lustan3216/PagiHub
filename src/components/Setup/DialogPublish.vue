<template>
  <el-button
    :disabled="!editingComponentSetId"
    type="text"
    @click.stop="open"
  >
    <b-icon-cloud-arrow-up
      style="padding-top: 1px;"
      class="m-r-5"
    />

    <dialog-username
      ref="dialogUsername"
      class="hidden"
      title="Sorry, we need a username to publish :)"
    />

    <dialog-confirmable
      v-if="node"
      :loading="loading"
      :visible.sync="visible"
      title="Publish"
      width="50%"
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

          <p class="font-12 gray-font-2">
            It is private for note.
          </p>

          <p
            v-if="node.publishAt"
            class="small-title"
          >
            Publish at {{ publishAt }}
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
import { BIconCloudArrowUp } from 'bootstrap-vue'
import { Message } from 'element-ui'
import DialogUsername from './DialogUsername'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default {
  name: 'DialogPublish',
  components: {
    DialogConfirmable,
    DialogUsername,
    TextEditorRich,
    BIconCloudArrowUp
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
    ...mapState('user', ['username']),
    canPublish() {
      return this.username
    },
    node() {
      return this.nodesMap[this.editingComponentSetId]
    },
    version() {
      return (this.node && this.node.version) || 0
    },
    publishAt() {
      return dayjs().to(dayjs(this.node.publishAt))
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
    open() {
      if (!this.canPublish) {
        this.$refs.dialogUsername.open()
      }
      else {
        this.visible = !this.visible
      }
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
