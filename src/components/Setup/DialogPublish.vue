<template>
  <el-button
    :disabled="!editingComponentSetId"
    icon="el-icon-upload"
    type="text"
    @click.stop="visible = !visible"
  >
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
          <el-input
            :autosize="{ minRows: 5 }"
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
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import { Message } from 'element-ui'

export default {
  name: 'DialogPublish',
  components: {
    DialogConfirmable
  },
  data() {
    const { componentsMap } = this.$store.state.component

    const node = componentsMap[this.id]

    return {
      visible: false,
      loading: false,
      form: {
        description: node ? node.description : ''
      }
    }
  },
  computed: {
    ...mapState('component', ['editingComponentSetId']),
    node() {
      return this.componentsMap[this.editingComponentSetId]
    },
    version() {
      return (this.node && this.node.version) || 1
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
    ...mapActions('component', ['publishComponentSet']),
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