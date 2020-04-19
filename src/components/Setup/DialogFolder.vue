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

        <el-form-item label="Auto Update">
          <el-checkbox v-model="form.autoUpdate" />
        </el-form-item>
      </el-form>
    </dialog-confirmable>
  </el-button>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import DialogConfirmable from '@/components/Components/DialogConfirmable'
import { TYPE } from '@/const'

export default {
  name: 'DialogFolder',
  components: {
    DialogConfirmable
  },
  props: {
    // eslint-disable-next-line
    id: {
      type: Number
    },
    // eslint-disable-next-line
    parentId: {
      type: Number
    }
  },
  data() {
    return {
      visible: false,
      form: {
        name: '',
        autoUpdate: true,
        description: '',
        categories: [],
        parentId: this.parentId,
        type: TYPE.FOLDER
      },
      categories: [
        { id: 0, label: 'Button' },
        { id: 1, label: 'Form' },
        { id: 2, label: 'Layout' },
        { id: 3, label: 'Card' }
      ]
    }
  },
  computed: {
    ...mapState('project', ['projectMap']),
    isExist() {
      return Boolean(this.id)
    }
  },
  created() {
    if (this.id) {
      Object.assign(this.form, this.projectMap[this.id])
    }
  },
  methods: {
    ...mapActions('project', ['appendProjectNode']),
    initData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.appendProjectNode(this.form)
          this.visible = false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
