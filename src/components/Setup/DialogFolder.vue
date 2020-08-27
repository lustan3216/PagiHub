<template>
  <el-button
    :icon="`el-icon-${isExist ? 's-tools' : 'folder-add'}`"
    type="text"
    @click.stop="visible = !visible"
  >
    <dialog-confirmable
      :visible.sync="visible"
      title="Folder"
      width="30%"
      @confirm="onSubmit"
      @close="initData"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="110px"
      >
        <el-form-item label="Name">
          <el-input v-model="form.name" />
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
import { mapState, mapActions } from 'vuex'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import { NODE_TYPE } from '@/const'

export default {
  name: 'DialogFolder',
  components: {
    DialogConfirmable
  },
  props: {
    // eslint-disable-next-line
    id: {
      type: String
    },
    // eslint-disable-next-line
    parentId: {
      type: String
    }
  },
  data() {
    return {
      visible: false,
      form: {
        name: '',
        description: '',
        parentId: this.parentId,
        type: NODE_TYPE.FOLDER
      }
    }
  },
  computed: {
    isExist() {
      return Boolean(this.id)
    }
  },
  created() {
    if (this.id) {
      Object.assign(this.form, this.componentsMap[this.id])
    }
  },
  methods: {
    ...mapActions('node', ['createFolder']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.createFolder(this.form)
          this.visible = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
